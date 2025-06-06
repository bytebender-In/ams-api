import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, Matches, MaxLength, MinLength, IsJSON, IsBoolean, IsInt, Min, Max } from 'class-validator';

export class CreateModuleFeatureDto {
  @ApiProperty({
    description: 'ID of the module this feature belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true
  })
  @IsUUID()
  module_id: string;

  @ApiProperty({
    description: 'Key of the feature (e.g., "attendance", "billing", "reports")',
    example: 'attendance',
    required: true,
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'feature_key must contain only lowercase letters, numbers, and hyphens'
  })
  feature_key: string;

  @ApiProperty({
    description: 'Value of the feature (e.g., "true", "false", or any other value)',
    example: 'true',
    required: true,
    minLength: 1,
    maxLength: 255
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  feature_value: string;

  @ApiProperty({
    description: 'Additional metadata for the feature (optional)',
    example: '{"max_users": 100, "allowed_roles": ["admin", "teacher"]}',
    required: false
  })
  @IsString()
  @IsOptional()
  @IsJSON()
  metadata?: string;

  @ApiProperty({
    description: 'Whether this feature is enabled by default',
    example: true,
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  is_enabled?: boolean;

  @ApiProperty({
    description: 'Priority level of the feature (1-5)',
    example: 1,
    required: false,
    minimum: 1,
    maximum: 5
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  priority?: number;
} 