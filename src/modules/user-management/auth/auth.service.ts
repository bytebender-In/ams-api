import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { addSeconds } from 'date-fns';
import { LoginDto } from './dto/signin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { PrismaService } from '@/core/database/prisma.service';
import { hashPassword, comparePassword } from '@/common/utils/crypto.utils';
import { LogoutDto } from './dto/logout.dto';
import { TokenBlacklistService } from './services/token-blacklist.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { password, email, username, ...userData } = createUserDto;

    // Check if email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new BadRequestException('Email already in use');
    }

    // Check if username already exists (only if username is provided)
    if (username) {
      const existingUserByUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUserByUsername) {
        throw new BadRequestException('Username already in use');
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in DB
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password_hash: hashedPassword,
        ...userData,
      },
    });

    const responseDto: UserResponseDto = {
      uuid: user.uuid,
      email: user.email,
      phone_number: user.phone_number ?? null,
      username: user.username ?? null,
      first_name: user.first_name,
      last_name: user.last_name,
      language: user.language,
      timezone: user.timezone,
      status: user.status,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified,
    };

    return responseDto;
  }

  async signin(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { identifier, password, device, browser, ipAddress, location } = loginDto;
  
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
          { phone_number: identifier },
        ],
      },
    });
  
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
  
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password. Please try again');
    }
  
    const accessTokenExpiration = this.configService.get('auth.jwtExpiration');
    const refreshTokenExpiration = this.configService.get('auth.refreshTokenExpiration');
  
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ sub: user.uuid }, { expiresIn: accessTokenExpiration }),
      this.jwtService.signAsync(
        { sub: user.uuid },
        {
          secret: this.configService.get('auth.refreshTokenSecret'),
          expiresIn: refreshTokenExpiration,
        }
      ),
    ]);
  
    const expiresAt = addSeconds(new Date(), this.parseExpirationToSeconds(refreshTokenExpiration));
  
    // Check if a session exists for same device + browser + IP
    const existingSession = await this.prisma.userSession.findFirst({
      where: {
        userId: user.uuid,
        device,
        browser,
        ipAddress,
        isActive: true,
      },
    });
  
    if (existingSession) {
      // Reuse session: update refresh token & timestamps
      await this.prisma.userSession.update({
        where: { id: existingSession.id },
        data: {
          refreshToken: refresh_token,
          loggedInAt: new Date(),
          expiresAt,
        },
      });
    } else {
      // Check active session count
      const activeSessions = await this.prisma.userSession.findMany({
        where: {
          userId: user.uuid,
          isActive: true,
        },
        orderBy: {
          loggedInAt: 'asc',
        },
      });
  
      // If already 5, remove oldest
      if (activeSessions.length >= 5) {
        await this.prisma.userSession.update({
          where: { id: activeSessions[0].id },
          data: {
            isActive: false,
            loggedOutAt: new Date(),
          },
        });
      }
  
      // Create new session
      await this.prisma.userSession.create({
        data: {
          userId: user.uuid,
          refreshToken: refresh_token,
          device,
          browser,
          ipAddress,
          location,
          expiresAt,
        },
      });
    }
  
    const response: UserResponseDto = {
      uuid: user.uuid,
      email: user.email,
      phone_number: user.phone_number ?? null,
      username: user.username ?? null,
      first_name: user.first_name,
      last_name: user.last_name,
      language: user.language,
      timezone: user.timezone,
      status: user.status,
      email_verified: user.email_verified,
      phone_verified: user.phone_verified,
    };
  
    return {
      message: 'Login successful',
      access_token,
      refresh_token,
      access_token_expires_in: this.parseExpirationToSeconds(accessTokenExpiration),
      refresh_token_expires_in: this.parseExpirationToSeconds(refreshTokenExpiration),
      user: response,
    };
  }
  
  async logout(userId: string, token: string, logoutDto: LogoutDto): Promise<void> {
    try {
      // Validate token format
      if (!token || typeof token !== 'string' || !token.includes('.')) {
        throw new BadRequestException('Invalid token format');
      }

      // Get token expiration from JWT
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken || typeof decodedToken === 'string') {
        throw new BadRequestException('Invalid token format');
      }

      const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);
      if (expiresIn <= 0) {
        throw new BadRequestException('Token has already expired');
      }

      // Blacklist the token
      await this.tokenBlacklistService.blacklistToken(token, expiresIn);

      // Update session status
      await this.prisma.userSession.updateMany({
        where: {
          userId,
          isActive: true,
          device: logoutDto.device,
          browser: logoutDto.browser,
          ipAddress: logoutDto.ipAddress,
        },
        data: {
          isActive: false,
          loggedOutAt: new Date(),
        },
      });

      this.logger.log(`User ${userId} logged out successfully`);
    } catch (error) {
      this.logger.error(`Logout failed for user ${userId}:`, error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Logout failed');
    }
  }

  async checkTokenStatus(token: string): Promise<{ 
    isValid: boolean;
    isBlacklisted: boolean;
    expiresAt?: Date;
    message: string;
  }> {
    try {
      // Validate token format
      if (!token || typeof token !== 'string' || !token.includes('.')) {
        throw new BadRequestException('Invalid token format');
      }

      // Check if token is blacklisted
      const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return {
          isValid: false,
          isBlacklisted: true,
          message: 'Token has been invalidated'
        };
      }

      // Verify token and get expiration
      try {
        const decoded = this.jwtService.verify(token);
        const expiresAt = new Date(decoded.exp * 1000);
        
        return {
          isValid: true,
          isBlacklisted: false,
          expiresAt,
          message: 'Token is valid'
        };
      } catch (error) {
        return {
          isValid: false,
          isBlacklisted: false,
          message: 'Token is invalid or expired'
        };
      }
    } catch (error) {
      this.logger.error('Error checking token status:', error);
      throw new BadRequestException('Failed to check token status');
    }
  }

  private parseExpirationToSeconds(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) return 0;

    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    switch (unit) {
      case 's': return numValue;
      case 'm': return numValue * 60;
      case 'h': return numValue * 3600;
      case 'd': return numValue * 86400;
      default: return 0;
    }
  }
}
