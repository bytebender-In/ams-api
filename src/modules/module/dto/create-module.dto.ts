import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { ModuleType } from '@prisma/client';

export class CreateModuleDto {
  @ApiProperty({
    description: 'Unique key for the module (e.g., "school-management")',
    example: 'school-management'
  })
  @IsString()
  module_key: string;

  @ApiProperty({
    description: 'Display name of the module',
    example: 'School Management'
  })
  @IsString()
  name: string;

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
    example: ModuleType.SCHOOL
  })
  @IsEnum(ModuleType)
  type: ModuleType;

} 