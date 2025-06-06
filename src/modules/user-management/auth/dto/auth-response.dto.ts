import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class VerificationInfoDto {
  @ApiProperty({
    description: 'Type of verification',
    example: 'unverified_email',
  })
  type: string;

  @ApiProperty({
    description: 'Identifier used for login (email/username/phone)',
    example: 'john.doe@example.com',
  })
  identifier: string;

  @ApiProperty({
    description: 'Verification status',
    example: false,
  })
  verified: boolean;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    nullable: true,
  })
  access_token: string | null;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    nullable: true,
  })
  refresh_token: string | null;

  @ApiProperty({
    description: 'Access token expiration time in seconds',
    example: 3600,
  })
  access_token_expires_in: number;

  @ApiProperty({
    description: 'Refresh token expiration time in seconds',
    example: 604800,
  })
  refresh_token_expires_in: number;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Verification information',
    type: VerificationInfoDto,
    required: false,
  })
  verification?: VerificationInfoDto;
} 