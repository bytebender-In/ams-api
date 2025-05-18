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
  import { Gender, UserStatus } from 'generated/prisma';
  
  export class CreateUserDto {
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
  
    @IsOptional()
    @IsString({ message: 'Phone number must be a string' })
    phone_number?: string;
  
    @IsOptional()
    @IsString({ message: 'Username must be a string' })
    username?: string;
  
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password_hash: string;
  
    @IsString({ message: 'First name must be a string' })
    @IsNotEmpty({ message: 'First name is required' })
    @MaxLength(50, { message: 'First name must be at most 50 characters long' })
    first_name: string;
  
    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    @MaxLength(50, { message: 'Last name must be at most 50 characters long' })
    last_name: string;
  
    @IsOptional()
    @IsString({ message: 'Profile picture must be a string URL' })
    profile_picture?: string;
  
    @IsEnum(Gender, { message: 'Gender must be one of the allowed values' })
    gender: Gender;
  
    @IsOptional()
    @IsDateString({}, { message: 'Date of birth must be a valid ISO 8601 date' })
    date_of_birth?: Date;
  
    @IsOptional()
    @IsString({ message: 'Language must be a string' })
    language?: string;
  
    @IsOptional()
    @IsString({ message: 'Timezone must be a string' })
    timezone?: string;
  
    @IsOptional()
    @IsEnum(UserStatus, { message: 'Status must be one of the allowed values' })
    status?: UserStatus;
  
    @IsOptional()
    @IsBoolean({ message: 'Email verified must be a boolean' })
    email_verified?: boolean;
  
    @IsOptional()
    @IsBoolean({ message: 'Phone verified must be a boolean' })
    phone_verified?: boolean;
  
    @IsOptional()
    @IsDateString({}, { message: 'Last login must be a valid ISO 8601 date' })
    last_login_at?: Date;
  
    @IsOptional()
    @IsInt({ message: 'Failed login attempts must be an integer' })
    failed_login_attempts?: number;
  
    @IsOptional()
    @IsDateString({}, { message: 'Last failed login must be a valid ISO 8601 date' })
    last_failed_login_at?: Date;
  
    @IsInt({ message: 'Role ID must be an integer' })
    role_id: number;
  }
  