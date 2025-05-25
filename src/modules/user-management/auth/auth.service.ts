import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/signin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { PrismaService } from '@/core/database/prisma.service';
import { hashPassword, comparePassword } from '@/common/utils/crypto.utils';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    const { identifier, password } = loginDto;

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
    const jwtSecret = this.configService.get('auth.jwtSecret');

    this.logger.debug(`JWT Configuration:`);
    this.logger.debug(`- JWT Secret: ${jwtSecret}`);
    this.logger.debug(`- Access Token Expiration: ${accessTokenExpiration}`);
    this.logger.debug(`- User UUID: ${user.uuid}`);

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.uuid },
        { expiresIn: accessTokenExpiration }
      ),
      this.jwtService.signAsync(
        { sub: user.uuid },
        { 
          secret: this.configService.get('auth.refreshTokenSecret'),
          expiresIn: refreshTokenExpiration
        }
      ),
    ]);

    this.logger.debug(`Generated Access Token: ${access_token}`);

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

    // Convert expiration times to seconds
    const accessTokenExpiresIn = this.parseExpirationToSeconds(accessTokenExpiration);
    const refreshTokenExpiresIn = this.parseExpirationToSeconds(refreshTokenExpiration);

    return {
      message:"Login successful",
      access_token,
      refresh_token,
      access_token_expires_in: accessTokenExpiresIn,
      refresh_token_expires_in: refreshTokenExpiresIn,
      user: response,
    };
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
