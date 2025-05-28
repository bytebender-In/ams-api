import { ApiProperty } from '@nestjs/swagger';
import { DeliveryMethod, VerificationType } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class SendVerificationDto {
  @ApiProperty({
    enum: VerificationType,
    example: VerificationType.EMAIL,
    description: 'Type of verification (EMAIL or PHONE)'
  })
  @IsEnum(VerificationType)
  verificationType: VerificationType;

  @ApiProperty({
    enum: DeliveryMethod,
    example: DeliveryMethod.OTP,
    description: 'Method of verification (OTP or LINK)'
  })
  @IsEnum(DeliveryMethod)
  method: DeliveryMethod;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address or phone number to verify'
  })
  @IsNotEmpty()
  identifier: string;
}

