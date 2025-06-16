import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { addSeconds } from 'date-fns';
import { PrismaService } from '@/core/database/prisma.service';
import { hashPassword, comparePassword } from '@/common/utils/crypto.utils';
import { LoginDto } from './dto/signin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LogoutDto } from './dto/logout.dto';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { SendVerificationDto } from './dto/send-verification.dto';
import { SendVerificationResponseDto } from './dto/send-verification-response.dto';
import { MailService } from '@/modules/mail/mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyEmailResponseDto } from './dto/verify-email-response.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '@/core/database/database.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokenBlacklistService: TokenBlacklistService,
    private mailService: MailService,
    private db: DatabaseService,
  ) {}

  private parseExpirationToSeconds(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    if (!match) return 0;

    const [, value, unit] = match;
    const numValue = parseInt(value, 10);

    switch (unit) {
      case 's':
        return numValue;
      case 'm':
        return numValue * 60;
      case 'h':
        return numValue * 3600;
      case 'd':
        return numValue * 86400;
      default:
        return 0;
    }
  }

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

    // Generate OTP for signup verification
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create verification record
    await this.prisma.userVerification.create({
      data: {
        userId: user.uuid,
        verificationType: 'EMAIL',
        method: 'OTP',
        identifier: email,
        code: otp,
        expiresAt,
      },
    });

    // Send welcome email with OTP
    await this.mailService.sendVerification({
      to: email,
      code: otp,
      method: 'OTP',
      isSignup: true,
    });

    return {
      message: 'Please verify your email. A verification email has been sent to your email address.',
      access_token: null,
      refresh_token: null,
      access_token_expires_in: 0,
      refresh_token_expires_in: 0,
      user: {
        uuid: user.uuid,
        email: user.email,
        phone_number: user.phone_number ?? null,
        username: user.username ?? null,
        first_name: user.first_name,
        last_name: user.last_name,
        language: user.language,
        timezone: user.timezone,
        status: user.status,
        email_verified: false,
        phone_verified: user.phone_verified,
      },
      verification: {
        type: 'unverified_email',
        identifier: email,
        verified: false
      }
    };
  }

  async signin(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { identifier, password, device, browser, ipAddress } = loginDto;
  
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

    // Check if email is verified
    if (!user.email_verified) {
      // Generate new verification token
      const verificationToken = this.generateToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create verification record
      await this.prisma.userVerification.create({
        data: {
          userId: user.uuid,
          verificationType: 'EMAIL',
          method: 'TOKEN',
          identifier: user.email,
          code: verificationToken,
          expiresAt,
        },
      });

      // Send verification email
      await this.mailService.sendVerification({
        to: user.email,
        code: verificationToken,
        method: 'TOKEN',
      });

      // Return response with unverified status
      return {
        message: 'Please verify your email first',
        access_token: null,
        refresh_token: null,
        access_token_expires_in: 0,
        refresh_token_expires_in: 0,
        user: {
          uuid: user.uuid,
          email: user.email,
          phone_number: user.phone_number ?? null,
          username: user.username ?? null,
          first_name: user.first_name,
          last_name: user.last_name,
          language: user.language,
          timezone: user.timezone,
          status: user.status,
          email_verified: false,
          phone_verified: user.phone_verified,
        }
      };
    }

    // Generate tokens
    const accessTokenExpiresIn = this.parseExpirationToSeconds(
      this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION') || '15m'
    );
    const refreshTokenExpiresIn = this.parseExpirationToSeconds(
      this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION') || '7d'
    );

    const accessToken = this.jwtService.sign(
      { sub: user.uuid, email: user.email },
      { expiresIn: accessTokenExpiresIn }
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.uuid, email: user.email },
      { expiresIn: refreshTokenExpiresIn }
    );

    return {
      message: 'Login successful',
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_expires_in: accessTokenExpiresIn,
      refresh_token_expires_in: refreshTokenExpiresIn,
      user: {
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
      }
    };
  }

  async logout(
    userId: string,
    token: string,
    logoutDto: LogoutDto,
  ): Promise<void> {
    const { device, browser, ipAddress } = logoutDto;

    // Add token to blacklist
    await this.tokenBlacklistService.blacklistToken(token, 3600); // 1 hour expiration

    // Log logout activity
    await this.prisma.userSession.create({
      data: {
        userId,
        device,
        browser,
        ipAddress,
        isActive: false,
        loggedOutAt: new Date(),
        refreshToken: token,
        expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour from now
      },
    });
  }

  async checkTokenStatus(token: string): Promise<{
    isValid: boolean;
    isBlacklisted: boolean;
    expiresAt?: Date;
    message: string;
  }> {
    try {
      const decoded = this.jwtService.verify(token);
      const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token);

      return {
        isValid: true,
        isBlacklisted,
        expiresAt: new Date(decoded.exp * 1000),
        message: isBlacklisted ? 'Token is blacklisted' : 'Token is valid',
      };
    } catch (error) {
      return {
        isValid: false,
        isBlacklisted: false,
        message: 'Token is invalid or expired',
      };
    }
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  async sendVerification(
    dto: SendVerificationDto,
  ): Promise<SendVerificationResponseDto> {
    const { identifier, verificationType } = dto;

    // Find user by identifier
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone_number: identifier },
        ],
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user is already verified
    if (verificationType === 'EMAIL' && user.email_verified) {
      throw new BadRequestException('Email is already verified');
    }
    if (verificationType === 'PHONE' && user.phone_verified) {
      throw new BadRequestException('Phone number is already verified');
    }

    // Generate verification code
    const code = verificationType === 'EMAIL' ? this.generateToken() : this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const method = verificationType === 'EMAIL' ? 'TOKEN' : 'OTP';

    // Find existing verification record
    const existingVerification = await this.prisma.userVerification.findFirst({
      where: {
        userId: user.uuid,
        verificationType,
      },
    });

    if (existingVerification) {
      // Update existing record
      await this.prisma.userVerification.update({
        where: { uvid: existingVerification.uvid },
        data: {
          code,
          expiresAt,
        },
      });
    } else {
      // Create new record
      await this.prisma.userVerification.create({
        data: {
          userId: user.uuid,
          verificationType,
          method,
          identifier,
          code,
          expiresAt,
        },
      });
    }

    // Send verification email/SMS
    if (verificationType === 'EMAIL') {
      await this.mailService.sendVerification({
        to: identifier,
        code,
        method: 'TOKEN',
      });
    } else {
      // TODO: Implement SMS sending
      throw new BadRequestException('SMS verification not implemented yet');
    }

    return {
      message: `Verification ${verificationType === 'EMAIL' ? 'email' : 'SMS'} sent successfully`,
      verificationType,
      identifier,
      method,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<VerifyEmailResponseDto> {
    const { code } = verifyEmailDto;

    // Find verification record
    const verification = await this.prisma.userVerification.findFirst({
      where: {
        code,
        verificationType: 'EMAIL',
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Update user's email verification status
    await this.prisma.user.update({
      where: { uuid: verification.userId },
      data: { email_verified: true },
    });

    // Delete verification record
    await this.prisma.userVerification.delete({
      where: { uvid: verification.uvid },
    });

    return {
      message: 'Email verified successfully',
      verified: true,
      userId: verification.userId,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.db.client.user.findUnique({
      where: { email }
    });

    if (user && await bcrypt.compare(password, user.password_hash)) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.uuid
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        uuid: user.uuid,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    };
  }

  async getProfile(userId: string) {
    const user = await this.db.client.user.findUnique({
      where: { uuid: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password_hash, ...result } = user;
    return result;
  }
}
