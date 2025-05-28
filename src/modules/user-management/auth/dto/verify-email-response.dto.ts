import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({
    description: 'Success message indicating the result of the verification',
    example: 'Email verified successfully',
    type: String,
    required: true,
  })
  message: string;

  @ApiProperty({
    description: 'Indicates whether the email verification was successful',
    example: true,
    type: Boolean,
    required: true,
    default: true,
  })
  verified: boolean;

  @ApiProperty({
    description: 'Unique identifier of the user whose email was verified',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true,
    format: 'uuid',
  })
  userId: string;
} 