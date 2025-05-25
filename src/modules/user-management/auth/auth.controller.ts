import { Controller, Post, Body, HttpCode, HttpStatus, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginDto } from './dto/signin.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Auth } from './decorators/auth.decorator';

@ApiTags('Authentication')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.authService.signup(createUserDto);
    return user;
  }

  @Post('logout')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(@Request() req) {
    return { message: 'Successfully logged out' };
  }
}
