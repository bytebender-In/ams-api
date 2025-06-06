import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString, IsEnum, IsOptional, IsArray, ValidateNested, IsString, IsBoolean, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { SubscriptionStatus } from '@prisma/client';

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
  @IsInt()
  limit_value: number;
}

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'ID of the user (UUID)',
    example: '8dd4bb5c-2725-4d3f-a312-8f7f60bdfeac'
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'ID of the plan',
    example: 1
  })
  @IsInt()
  plan_id: number;

  @ApiProperty({
    description: 'ID of the organization (optional, can be set later)',
    example: 'org-123',
    required: false
  })
  @IsString()
  @IsOptional()
  organization_id?: string;

  @ApiProperty({
    description: 'Start date of the subscription',
    example: '2024-01-01T00:00:00Z'
  })
  @IsDateString()
  start_date: string;

  @ApiProperty({
    description: 'End date of the subscription',
    example: '2024-12-31T23:59:59Z'
  })
  @IsDateString()
  end_date: string;

  @ApiProperty({
    description: 'Status of the subscription',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.active,
    default: SubscriptionStatus.active
  })
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @ApiProperty({
    description: 'Module access configuration',
    type: [ModuleAccessDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleAccessDto)
  module_access: ModuleAccessDto[];
} 