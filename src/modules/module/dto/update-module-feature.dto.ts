import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateModuleFeatureDto {
  @ApiProperty({
    description: 'Key of the feature (e.g., "attendance", "billing")',
    required: false,
    example: 'attendance'
  })
  @IsString()
  @IsOptional()
  feature_key?: string;

  @ApiProperty({
    description: 'Value of the feature (e.g., "true", "false", or any other value)',
    required: false,
    example: 'true'
  })
  @IsString()
  @IsOptional()
  feature_value?: string;
} 