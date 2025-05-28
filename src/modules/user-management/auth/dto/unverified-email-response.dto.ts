import { ApiProperty } from '@nestjs/swagger';

export class UnverifiedEmailResponseDto {
  @ApiProperty({
    description: 'Error message indicating email verification is required',
    example: 'Please verify your email first',
    type: String,
    required: true,
  })
  message: string;

  @ApiProperty({
    description: 'Indicates that email is not verified',
    example: false,
    type: Boolean,
    required: true,
    default: false,
  })
  email_verified: boolean;

  @ApiProperty({
    description: 'Email address that needs verification',
    example: 'john.doe@example.com',
    type: String,
    required: true,
    format: 'email',
  })
  email: string;

  @ApiProperty({
    description: 'User ID of the unverified account',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true,
    format: 'uuid',
  })
  userId: string;
} 