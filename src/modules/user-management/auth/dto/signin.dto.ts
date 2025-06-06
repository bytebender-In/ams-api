import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'Email or username or phone number' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    }
  )
  password: string;

  @ApiPropertyOptional({ example: 'Device name' })
  @IsOptional()
  @IsString()
  device?: string;

  @ApiPropertyOptional({ example: 'Chrome, Firefox' })
  @IsOptional()
  @IsString()
  browser?: string;

  @ApiPropertyOptional({ example: 'IP of user at login' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ example: 'Geolocation' })
  @IsOptional()
  @IsString()
  location?: string;
}
