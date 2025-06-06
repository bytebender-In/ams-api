import { ApiProperty } from '@nestjs/swagger';
import { ModuleType } from '@prisma/client';

export class ModuleFeatureResponseDto {
  @ApiProperty()
  mfuid: string;

  @ApiProperty()
  module_id: string;

  @ApiProperty()
  feature_key: string;

  @ApiProperty()
  feature_value: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class ModuleResponseDto {
  @ApiProperty()
  muid: string;

  @ApiProperty()
  module_key: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty({ required: false, nullable: true })
  icon: string | null;

  @ApiProperty({ enum: ModuleType })
  type: ModuleType;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty({ required: false, nullable: true })
  parent_id: string | null;

  @ApiProperty({ type: [ModuleFeatureResponseDto], required: false })
  features?: ModuleFeatureResponseDto[];

  @ApiProperty({ type: [ModuleResponseDto], required: false })
  children?: ModuleResponseDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
} 