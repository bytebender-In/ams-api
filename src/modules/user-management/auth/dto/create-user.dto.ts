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
  
  export class CreateUserDto {
    @ApiProperty({ description: 'User email address', type: String })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
  
    @ApiPropertyOptional({ description: 'Username', type: String })
    @IsOptional()
    @IsString({ message: 'Username must be a string' })
    username?: string;
  
    @ApiProperty({ description: 'Password for user account (will be hashed)', type: String })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string; 
  
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
  
    @ApiProperty({ description: 'Gender of the user', type: String })
    @IsOptional()
    @IsString({ message: 'Gender must be a string' })
    gender?: string;
  
    @ApiPropertyOptional({ description: 'Timezone of the user', type: String })
    @IsOptional()
    @IsString({ message: 'Timezone must be a string' })
    timezone?: string;
  
  }
  