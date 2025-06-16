import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';

/**
 * Data Transfer Object for creating a new module type
 * @description Represents the structure and validation rules for creating a module type
 */
export class CreateModuleTypeDto {
  @ApiProperty({
    description: 'Unique key identifier for the module type (e.g., SCHOOL, HOSPITAL)',
    example: 'SCHOOL',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[A-Z_]+$/, {
    message: 'Key must contain only uppercase letters and underscores',
  })
  key: string;

  @ApiProperty({
    description: 'Display name of the module type',
    example: 'School Management',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the module type',
    example: 'A comprehensive system for managing educational institutions',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Category grouping for the module type',
    example: 'EDUCATION',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({
    description: 'Whether the module type is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
} 