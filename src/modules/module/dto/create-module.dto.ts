import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, MinLength, MaxLength, Matches } from 'class-validator';
import { IdPrefix } from '@/common/utils/uid.utils';

/**
 * Data Transfer Object for creating a new module
 * @description Represents the structure and validation rules for creating a module
 */
export class CreateModuleDto {
  @ApiProperty({
    description: 'Unique key identifier for the module',
    example: 'SCHOOL_MANAGEMENT',
    minLength: 2,
    maxLength: 50,
    required: true
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[A-Z_]+$/, {
    message: 'Key must contain only uppercase letters and underscores',
  })
  module_key: string;

  @ApiProperty({
    description: 'Display name of the module',
    example: 'School Management',
    minLength: 2,
    maxLength: 100,
    required: true
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the module',
    example: 'Comprehensive school management system for handling students, teachers, and classes',
    maxLength: 500,
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Icon identifier for the module',
    example: 'school',
    maxLength: 50,
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({
    description: 'ID of the module type this module belongs to',
    example: 'mot_123456789abcdefghijk',
    required: true
  })
  @IsString()
  @Matches(/^mot_[a-zA-Z0-9]{21}$/, {
    message: 'Type ID must be in the format mot_<21 characters>',
  })
  type_id: string;

  @ApiPropertyOptional({
    description: 'ID of the parent module (if this is a submodule)',
    example: 'mod_987654321abcdefghijk',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @Matches(/^mod_[a-zA-Z0-9]{21}$/, {
    message: 'Parent ID must be in the format mod_<21 characters>',
  })
  parent_id?: string;

  @ApiPropertyOptional({
    description: 'Whether the module is active',
    example: true,
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
} 