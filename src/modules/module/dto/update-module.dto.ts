import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { ModuleType } from '@prisma/client';

export class UpdateModuleDto {
  @ApiProperty({
    description: 'Unique key for the module (e.g., "school-management")',
    required: false,
    example: 'school-management'
  })
  @IsString()
  @IsOptional()
  module_key?: string;

  @ApiProperty({
    description: 'Display name of the module',
    required: false,
    example: 'School Management'
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description of the module',
    required: false,
    example: 'Complete school management system'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Icon class or URL for the module',
    required: false,
    example: 'fa-school'
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: 'Type of the module',
    enum: ModuleType,
    required: false,
    example: ModuleType.SCHOOL
  })
  @IsEnum(ModuleType)
  @IsOptional()
  type?: ModuleType;

  @ApiProperty({
    description: 'Whether the module is active',
    required: false,
    example: true
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    description: 'Parent module ID for hierarchical structure',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsOptional()
  parent_id?: string;
} 