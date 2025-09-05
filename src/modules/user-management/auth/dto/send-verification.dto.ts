import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Matches, IsString } from 'class-validator';

export class SendVerificationDto {
  @ApiProperty({
    type: String,
    example: 'EMAIL',
    description: 'Type of verification (EMAIL or PHONE)'
  })
  @IsString()
  @IsNotEmpty()
  verificationType: string;

  @ApiProperty({
    type: String,
    example: 'OTP',
    description: 'Method of verification (OTP or LINK)'
  })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address or phone number to verify'
  })
  @IsNotEmpty()
  identifier: string;
}

