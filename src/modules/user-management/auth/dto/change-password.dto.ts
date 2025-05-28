import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password of the user',
    example: 'CurrentPass123!',
    minLength: 8
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password for the user. Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
    example: 'NewPass123!',
    minLength: 8
  })
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  newPassword: string;
} 