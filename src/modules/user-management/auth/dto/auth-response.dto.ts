import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class AuthResponseDto {
  @ApiProperty({ example: 'Login successful' })
  message: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ example: 900, description: 'Access token expiration in seconds' })
  access_token_expires_in: number;

  @ApiProperty({ example: 604800, description: 'Refresh token expiration in seconds' })
  refresh_token_expires_in: number;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
} 