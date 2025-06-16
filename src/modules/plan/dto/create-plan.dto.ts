import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max, Matches, MaxLength, MinLength, IsEnum } from 'class-validator';

export enum PlanInterval {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  QUARTERLY = 'quarterly',
  BIANNUAL = 'biannual'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  INR = 'INR'
}

/**
 * Data Transfer Object for creating a new plan
 * @description Represents the structure and validation rules for creating a plan
 */
export class CreatePlanDto {
  @ApiProperty({
    description: 'Display name of the plan',
    example: 'Basic Plan',
    minLength: 2,
    maxLength: 100,
    required: true
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the plan',
    example: 'Basic plan with essential features for small organizations',
    maxLength: 500,
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Price of the plan',
    example: 99.99,
    minimum: 0,
    required: true
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Currency of the plan price',
    example: 'INR',
    enum: Currency,
    required: true
  })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    description: 'Duration of the plan in months',
    example: 12,
    minimum: 1,
    maximum: 60,
    required: true
  })
  @IsNumber()
  @Min(1)
  @Max(60)
  duration_months: number;

  @ApiProperty({
    description: 'Billing interval for the plan',
    example: 'monthly',
    enum: PlanInterval,
    required: true
  })
  @IsEnum(PlanInterval)
  interval: PlanInterval;

  @ApiPropertyOptional({
    description: 'Validity period in days (e.g., 7 for weekly, 30 for monthly, 365 for yearly)',
    example: 30,
    minimum: 1,
    maximum: 3650,
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(3650)
  validity_days?: number;

  @ApiPropertyOptional({
    description: 'Whether the plan is active',
    example: true,
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
} 