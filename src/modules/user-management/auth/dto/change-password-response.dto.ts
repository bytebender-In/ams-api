import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResponseDto {
  @ApiProperty({
    example: 200,
    description: 'HTTP status code'
  })
  code: number;

  @ApiProperty({
    example: 'success',
    description: 'Response type (success/error)'
  })
  type: string;

  @ApiProperty({
    example: 'Password changed successfully. Please login again with your new password.',
    description: 'Response message'
  })
  message: string;
} 