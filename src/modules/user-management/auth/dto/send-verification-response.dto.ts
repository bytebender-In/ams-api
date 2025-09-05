import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationResponseDto {
  @ApiProperty({
    example: 'Verification sent successfully',
    description: 'Status message indicating the result of the verification request'
  })
  message: string;

  @ApiProperty({
    type: String,
    example: 'EMAIL',
    description: 'Type of verification (EMAIL or PHONE)'
  })
  verificationType: string;

  @ApiProperty({
    type: String,
    example: 'OTP',
    description: 'Method used for verification (OTP or LINK)'
  })
  method: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address or phone number that was verified'
  })
  identifier: string;

  @ApiProperty({
    example: '2025-05-27T10:30:00.000Z',
    description: 'Expiration timestamp for the verification code/link'
  })
  expiresAt: string;
} 