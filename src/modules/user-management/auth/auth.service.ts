import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PrismaService } from '@/core/database/prisma.service';
import { hashPassword } from '@/common/utils/crypto.utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    // private jwtService: JwtService,
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

  async login(loginDto: LoginDto) {
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.uuid };
    // const access_token = await this.jwtService.signAsync(payload);

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
      // access_token: access_token,
      user: response,
    };
  }
}
