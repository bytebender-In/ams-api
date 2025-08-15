import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

/**
 * Data Transfer Object for plan features
 * @description Represents the structure and validation rules for plan features
 */
export class PlanFeatureDto {
  @ApiProperty({
    description: 'Type of the feature',
    example: 'student_management',
    required: true
  })
  @IsString()
  @MaxLength(50)
  feature_type: string;

  @ApiProperty({
    description: 'Whether the feature is enabled',
    example: true,
    default: true,
    required: true
  })
  @IsBoolean()
  is_enabled: boolean;

  @ApiPropertyOptional({
    description: 'Region for which this feature applies',
    example: 'global',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  region?: string;
}

/**
 * Data Transfer Object for creating plan features
 */
export class CreatePlanFeatureDto {
  @ApiProperty({
    description: 'Type of the feature',
    example: 'api_access',
    required: true
  })
  @IsString()
  feature_type: string;

  @ApiProperty({
    description: 'Value of the feature',
    example: '1000',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  value?: string | null;

  @ApiProperty({
    description: 'Whether the feature is enabled',
    example: true,
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  is_enabled?: boolean;

  @ApiProperty({
    description: 'Region where this feature applies',
    example: 'us-east-1',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  region?: string | null;

  @ApiProperty({
    description: 'ID of the module this feature belongs to',
    example: 'mod_api',
    required: false
  })
  @IsString()
  @IsOptional()
  module_id?: string;
}

/**
 * Data Transfer Object for updating plan features
 */
export class UpdatePlanFeatureDto extends PartialType(CreatePlanFeatureDto) {}

/**
 * Data Transfer Object for plan feature responses
 */
export class PlanFeatureResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the feature',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Plan ID this feature belongs to',
    example: 'pla_123456789'
  })
  plan_id: string;

  @ApiProperty({
    description: 'Type of the feature',
    example: 'api_access'
  })
  feature_type: string;

  @ApiProperty({
    description: 'Value of the feature',
    example: '1000',
    nullable: true
  })
  value?: string | null;

  @ApiProperty({
    description: 'Whether the feature is enabled',
    example: true
  })
  is_enabled: boolean;

  @ApiProperty({
    description: 'Region where this feature applies',
    example: 'us-east-1',
    nullable: true
  })
  region?: string | null;

  @ApiProperty({
    description: 'Module this feature belongs to',
    required: false,
    nullable: true
  })
  module?: {
    mouid: string;
    name: string;
    module_key: string;
    type_id: string;
    description: string | null;
    icon: string | null;
    is_active: boolean;
    parent_id: string | null;
    created_at: Date;
    updated_at: Date;
  } | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-02-20T10:00:00Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-02-20T10:00:00Z'
  })
  updated_at: Date;
} 