import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, MaxLength,  } from 'class-validator';

/**
 * Data Transfer Object for plan limits
 * @description Represents the structure and validation rules for plan limits
 */
export class PlanLimitDto {
  @ApiProperty({
    description: 'Type of the limit (e.g., max_users, max_orgs)',
    example: 'max_users',
    required: true
  })
  @IsString()
  @MaxLength(50)
  limit_type: string;

  @ApiProperty({
    description: 'Value of the limit',
    example: 100,
    minimum: 0,
    required: true
  })
  @IsNumber()
  @Min(0)
  limit_value: number;

  @ApiPropertyOptional({
    description: 'Region for which this limit applies',
    example: 'US',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  region?: string;
}

/**
 * Data Transfer Object for creating plan limits
 */
export class CreatePlanLimitDto {
  @ApiProperty({
    description: 'Type of the limit',
    example: 'MAX_ORGANIZATION',
    required: true
  })
  @IsString()
  limit_type: string;

  @ApiProperty({
    description: 'Value of the limit',
    example: 1000,
    required: true
  })
  @IsNumber()
  limit_value: number;

  @ApiProperty({
    description: 'Region where this limit applies',
    example: 'us-east-1',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  region?: string | null;
}

/**
 * Data Transfer Object for updating plan limits
 */
export class UpdatePlanLimitDto extends PartialType(CreatePlanLimitDto) {}

/**
 * Data Transfer Object for plan limit responses
 */
export class PlanLimitResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the limit',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Plan ID this limit belongs to',
    example: 'pla_123456789'
  })
  plan_id: string;

  @ApiProperty({
    description: 'Type of the limit',
    example: 'MAX_ORGANIZATION'
  })
  limit_type: string;

  @ApiProperty({
    description: 'Value of the limit',
    example: 1000
  })
  limit_value: number;

  @ApiProperty({
    description: 'Region where this limit applies',
    example: 'global',
    nullable: true
  })
  region?: string | null;

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