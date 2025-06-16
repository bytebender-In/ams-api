import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Response DTO for module type data
 * @description Represents the structure of module type data returned by the API
 */
export class ModuleTypeResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the module type',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  motuid: string;

  @ApiProperty({
    description: 'Unique key identifier for the module type',
    example: 'SCHOOL',
  })
  key: string;

  @ApiProperty({
    description: 'Display name of the module type',
    example: 'School Management',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the module type',
    example: 'A comprehensive system for managing educational institutions',
    nullable: true,
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Category grouping for the module type',
    example: 'EDUCATION',
    nullable: true,
  })
  category?: string;

  @ApiProperty({
    description: 'Whether the module type is active',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Timestamp when the module type was created',
    example: '2024-03-20T10:00:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp when the module type was last updated',
    example: '2024-03-20T10:00:00Z',
  })
  updated_at: Date;
} 