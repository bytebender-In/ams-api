import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ModuleAccessDto {
  @ApiProperty({ description: 'Module ID' })
  @IsString()
  module_id: string;

  @ApiProperty({ description: 'Whether the module is active', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ description: 'Module limits', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleLimitDto)
  limits: ModuleLimitDto[];
}

class ModuleLimitDto {
  @ApiProperty({ description: 'Limit key (e.g., max_users, max_roles)', example: 'max_users' })
  @IsString()
  limit_key: string;

  @ApiProperty({ description: 'Limit value', example: 10000 })
  @IsNumber()
  limit_value: number;
}

export class CreatePlanDto {
  @ApiProperty({
    description: 'Name of the plan',
    example: 'Basic Plan'
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Description of the plan',
    required: false,
    example: 'Basic features for small organizations'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Price of the plan',
    example: 29.99
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
    default: 'USD'
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'Duration of the plan',
    example: 30
  })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Interval of the plan (monthly, yearly, etc.)',
    example: 'monthly'
  })
  @IsString()
  interval: string;

  @ApiProperty({
    description: 'Whether the plan is active',
    example: true,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'Module access configuration',
    type: [ModuleAccessDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleAccessDto)
  module_access: ModuleAccessDto[];
} 