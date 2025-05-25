import { Controller, Get, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { UserResponseDto } from '../dto/user-response.dto';

@ApiTags('User Management')
@Controller()
export class BaseController {
  @Get('profile')
  @Auth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  getProfile(@Request() req) {
    return req.user;
  }
} 