import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  IsEnum,
  MinLength,
  MaxLength,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, UserStatus } from 'generated/prisma';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address', type: String })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiPropertyOptional({ description: 'User phone number', type: String })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phone_number?: string;

  @ApiPropertyOptional({ description: 'Username', type: String })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @ApiProperty({ description: 'Password for user account (will be hashed)', type: String })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password_hash: string;

  @ApiProperty({ description: 'First name of the user', type: String })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MaxLength(50, { message: 'First name must be at most 50 characters long' })
  first_name: string;

  @ApiProperty({ description: 'Last name of the user', type: String })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MaxLength(50, { message: 'Last name must be at most 50 characters long' })
  last_name: string;

  @ApiPropertyOptional({ description: 'URL of the profile picture', type: String })
  @IsOptional()
  @IsString({ message: 'Profile picture must be a string URL' })
  profile_picture?: string;

  @ApiProperty({ description: 'Gender of the user', enum: Gender })
  @IsEnum(Gender, { message: 'Gender must be one of the allowed values' })
  gender: Gender;

  @ApiPropertyOptional({ description: 'Date of birth in ISO 8601 format', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString({}, { message: 'Date of birth must be a valid ISO 8601 date' })
  date_of_birth?: Date;

  @ApiPropertyOptional({ description: 'Preferred language', type: String })
  @IsOptional()
  @IsString({ message: 'Language must be a string' })
  language?: string;

  @ApiPropertyOptional({ description: 'Timezone of the user', type: String })
  @IsOptional()
  @IsString({ message: 'Timezone must be a string' })
  timezone?: string;

  @ApiPropertyOptional({ description: 'Current status of the user account', enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status must be one of the allowed values' })
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'Is email verified?', type: Boolean })
  @IsOptional()
  @IsBoolean({ message: 'Email verified must be a boolean' })
  email_verified?: boolean;

  @ApiPropertyOptional({ description: 'Is phone number verified?', type: Boolean })
  @IsOptional()
  @IsBoolean({ message: 'Phone verified must be a boolean' })
  phone_verified?: boolean;

  @ApiPropertyOptional({ description: 'Timestamp of last login', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString({}, { message: 'Last login must be a valid ISO 8601 date' })
  last_login_at?: Date;

  @ApiPropertyOptional({ description: 'Number of failed login attempts', type: Number })
  @IsOptional()
  @IsInt({ message: 'Failed login attempts must be an integer' })
  failed_login_attempts?: number;

  @ApiPropertyOptional({ description: 'Timestamp of last failed login attempt', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString({}, { message: 'Last failed login must be a valid ISO 8601 date' })
  last_failed_login_at?: Date;

  @ApiProperty({ description: 'Role ID assigned to the user', type: Number })
  @IsInt({ message: 'Role ID must be an integer' })
  role_id?: number;
}
