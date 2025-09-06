import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../../../core/database/database.service';
import { SignInDto } from '../dto/signin.dto';
import { SignUpDto } from '../dto/signup.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = signUpDto;

    // Check if user already exists
    const existingUser = await this.databaseService.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user using Supabase auth structure
    const user = await this.databaseService.users.create({
      data: {
        id: randomUUID(),
        email,
        encrypted_password: hashedPassword,
        email_confirmed_at: new Date(),
        raw_user_meta_data: {
          firstName,
          lastName,
        },
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email || '');

    // Save refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User registered successfully: ${user.email}`);

    return {
      user: this.mapUserToResponse(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    // Find user
    const user = await this.databaseService.users.findFirst({
      where: { email },
    });

    if (!user || !user.encrypted_password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.encrypted_password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is banned
    if (user.banned_until && user.banned_until > new Date()) {
      throw new UnauthorizedException('Account is temporarily banned');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email || '');

    // Save refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    this.logger.log(`User signed in successfully: ${user.email}`);

    return {
      user: this.mapUserToResponse(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    // Remove refresh token sessions
    await this.databaseService.sessions.deleteMany({
      where: { user_id: userId },
    });

    this.logger.log(`User logged out: ${userId}`);

    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.databaseService.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.mapUserToResponse(user);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    // Verify refresh token
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    // Check if refresh token exists in database
    const session = await this.databaseService.sessions.findFirst({
      where: {
        user_id: payload.sub,
        // Note: Supabase sessions don't store refresh tokens directly
        // This is a simplified implementation
      },
      include: {
        users: true,
      },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(
      session.users.id,
      session.users.email || '',
    );

    return {
      user: this.mapUserToResponse(session.users),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(
    userId: string,
    _refreshToken: string,
  ): Promise<void> {
    // Remove existing sessions for this user
    await this.databaseService.sessions.deleteMany({
      where: { user_id: userId },
    });

    // Create new session
    await this.databaseService.sessions.create({
      data: {
        id: randomUUID(),
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  private mapUserToResponse(user: any): UserResponseDto {
    const metaData = (user.raw_user_meta_data as any) || {};

    return {
      id: user.id,
      email: user.email || '',
      firstName: metaData.firstName || '',
      lastName: metaData.lastName || '',
      isEmailVerified: !!user.email_confirmed_at,
      isActive: !user.banned_until || user.banned_until <= new Date(),
      createdAt: user.created_at || new Date(),
      updatedAt: user.updated_at || new Date(),
    };
  }
}