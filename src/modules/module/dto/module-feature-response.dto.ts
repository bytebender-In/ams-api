import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for module feature responses
 * @description Represents the structure of module feature data in responses
 */
export class ModuleFeatureResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the feature',
    example: 'mof_123456789abcdefghijk'
  })
  mofuid: string;

  @ApiProperty({
    description: 'ID of the module this feature belongs to',
    example: 'mod_123456789abcdefghijk'
  })
  module_id: string;

  @ApiProperty({
    description: 'Unique key identifier of the feature',
    example: 'ENABLE_STUDENT_REGISTRATION'
  })
  feature_key: string;

  @ApiProperty({
    description: 'Value of the feature',
    example: 'true'
  })
  feature_value: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the feature',
    example: '{"max_students": 1000, "allowed_roles": ["ADMIN", "TEACHER"]}'
  })
  metadata?: string;

  @ApiProperty({
    description: 'Whether the feature is enabled',
    example: true
  })
  is_enabled: boolean;

  @ApiProperty({
    description: 'Priority of the feature (1-10)',
    example: 1
  })
  priority: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-03-20T10:00:00Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-20T10:00:00Z'
  })
  updated_at: Date;
} 