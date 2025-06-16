import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, Min, Max, Matches, MaxLength } from 'class-validator';

/**
 * Data Transfer Object for creating a module feature
 * @description Represents the structure and validation rules for creating a module feature
 */
export class CreateModuleFeatureDto {
  @ApiProperty({
    description: 'Unique key identifier for the feature',
    example: 'ENABLE_STUDENT_REGISTRATION',
    minLength: 2,
    maxLength: 50,
    required: true
  })
  @IsString()
  @Matches(/^[A-Z_]+$/, {
    message: 'Feature key must contain only uppercase letters and underscores'
  })
  feature_key: string;

  @ApiProperty({
    description: 'Value of the feature',
    example: 'true',
    minLength: 1,
    maxLength: 255,
    required: true
  })
  @IsString()
  feature_value: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the feature',
    example: '{"max_students": 1000, "allowed_roles": ["ADMIN", "TEACHER"]}',
    maxLength: 1000,
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  metadata?: string;

  @ApiPropertyOptional({
    description: 'Whether the feature is enabled',
    example: true,
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  is_enabled?: boolean;

  @ApiPropertyOptional({
    description: 'Priority of the feature (1-10)',
    example: 1,
    minimum: 1,
    maximum: 10,
    default: 1,
    required: false
  })
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  priority?: number;
} 