import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanFeatureResponseDto } from './plan-feature.dto';
import { PlanLimitResponseDto } from './plan-limit.dto';

/**
 * Data Transfer Object for plan responses
 * @description Represents the structure of plan data in responses
 */
export class PlanResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the plan',
    example: 'pla_123456789abcdefghijk',
    required: true
  })
  puid: string;

  @ApiProperty({
    description: 'Display name of the plan',
    example: 'Basic Plan',
    required: true
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the plan',
    example: 'Basic plan with essential features for small organizations',
    required: false,
    nullable: true
  })
  description?: string;

  @ApiProperty({
    description: 'Price of the plan',
    example: 99.99,
    required: true
  })
  price: number;

  @ApiProperty({
    description: 'Currency of the plan price',
    example: 'INR',
    required: true
  })
  currency: string;

  @ApiProperty({
    description: 'Duration of the plan in months',
    example: 12,
    required: true
  })
  duration_months: number;

  @ApiProperty({
    description: 'Billing interval for the plan',
    example: 'monthly',
    required: true
  })
  interval: string;

  @ApiPropertyOptional({
    description: 'Validity period in days',
    example: 365,
    required: false
  })
  validity_days?: number;

  @ApiProperty({
    description: 'Whether the plan is active',
    example: true,
    required: true
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-03-20T10:00:00Z',
    required: true
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-20T10:00:00Z',
    required: true
  })
  updated_at: Date;

  @ApiProperty({
    description: 'Features included in this plan',
    type: [PlanFeatureResponseDto],
    required: true
  })
  features: PlanFeatureResponseDto[];

  @ApiProperty({
    description: 'Limits applied to this plan',
    type: [PlanLimitResponseDto],
    required: true
  })
  limits: PlanLimitResponseDto[];
} 