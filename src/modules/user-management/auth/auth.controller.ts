import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  Headers,
  UnauthorizedException,
  BadRequestException,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginDto } from './dto/signin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Auth } from './decorators/auth.decorator';
import { LogoutDto } from './dto/logout.dto';
import {
  CurrentUser,
  AuthUserPayload,
} from './decorators/current-user.decorator';
import { SendVerificationDto } from './dto/send-verification.dto';
import { SendVerificationResponseDto } from './dto/send-verification-response.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyEmailResponseDto } from './dto/verify-email-response.dto';
import { UnverifiedEmailResponseDto } from './dto/unverified-email-response.dto';

@ApiTags('Authentication')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({
    status: 401,
    description: 'Email not verified',
    type: UnverifiedEmailResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async signin(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.signin(loginDto);
  }
  /**
   * User Signup Endpoint
   * Registers a new user in the system.
   * @param createUserDto - Validated user data for signup
   * @returns UserResponseDto with public user information
   */
  @Post('signup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async signup(@Body() createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    return this.authService.signup(createUserDto);
  }

  @Delete('logout')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current session' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  @ApiBearerAuth()
  async logout(
    @CurrentUser() user: AuthUserPayload,
    @Body() logoutDto: LogoutDto,
    @Headers('authorization') authHeader: string,
  ): Promise<{ message: string }> {
    // Extract token from Bearer header
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new BadRequestException('Authorization header is required');
    }

    await this.authService.logout(user.uuid, token, logoutDto);
    return { message: 'Logged out successfully' };
  }

  @Get('token/status')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check token status' })
  @ApiResponse({ status: 200, description: 'Token status information' })
  @ApiBearerAuth()
  async checkTokenStatus(
    @Headers('authorization') authHeader: string,
  ): Promise<{
    isValid: boolean;
    isBlacklisted: boolean;
    expiresAt?: Date;
    message: string;
  }> {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new BadRequestException('Authorization header is required');
    }

    return this.authService.checkTokenStatus(token);
  }

  @Post('send-verification')
  @ApiOperation({ summary: 'Send OTP or verification token to email or phone' })
  @ApiResponse({ status: 201, description: 'Verification sent successfully' , type: SendVerificationResponseDto  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or already verified',
  })
  sendVerification(@Body() dto: SendVerificationDto): Promise<SendVerificationResponseDto> {
    return this.authService.sendVerification(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email using OTP or token' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: VerifyEmailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification code',
  })
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<VerifyEmailResponseDto> {
    return this.authService.verifyEmail(verifyEmailDto);
  }
}
