import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object for module responses
 * @description Represents the structure of module data in responses
 */
export class ModuleResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the module',
    example: 'mod_123456789abcdefghijk',
    required: true
  })
  mouid: string;

  @ApiProperty({
    description: 'Unique key identifier of the module',
    example: 'SCHOOL_MANAGEMENT',
    required: true
  })
  module_key: string;

  @ApiProperty({
    description: 'Display name of the module',
    example: 'School Management',
    required: true
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the module',
    example: 'Comprehensive school management system for handling students, teachers, and classes',
    required: false,
    nullable: true
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Icon identifier for the module',
    example: 'school',
    required: false,
    nullable: true
  })
  icon?: string;

  @ApiProperty({
    description: 'ID of the module type this module belongs to',
    example: 'mot_123456789abcdefghijk',
    required: true
  })
  type_id: string;

  @ApiProperty({
    description: 'Module type details',
    type: 'object',
    properties: {
      motuid: { 
        type: 'string', 
        example: 'mot_123456789abcdefghijk',
        required: true 
      },
      key: { 
        type: 'string', 
        example: 'SCHOOL',
        required: true 
      },
      name: { 
        type: 'string', 
        example: 'School Management',
        required: true 
      },
      description: { 
        type: 'string', 
        example: 'School management system type',
        required: false,
        nullable: true 
      },
      category: { 
        type: 'string', 
        example: 'EDUCATION',
        required: false,
        nullable: true 
      }
    }
  })
  type: {
    motuid: string;
    key: string;
    name: string;
    description?: string;
    category?: string;
  };

  @ApiProperty({
    description: 'Whether the module is active',
    example: true,
    required: true
  })
  is_active: boolean;

  @ApiPropertyOptional({
    description: 'ID of the parent module (if this is a submodule)',
    example: 'mod_987654321abcdefghijk',
    required: false,
    nullable: true
  })
  parent_id?: string;

  @ApiPropertyOptional({
    description: 'Parent module details (if exists)',
    type: 'object',
    nullable: true,
    properties: {
      mouid: { 
        type: 'string', 
        example: 'mod_123456789abcdefghijk',
        required: true 
      },
      module_key: { 
        type: 'string', 
        example: 'PARENT_MODULE',
        required: true 
      },
      name: { 
        type: 'string', 
        example: 'Parent Module',
        required: true 
      }
    }
  })
  parent?: {
    mouid: string;
    module_key: string;
    name: string;
  };

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
} 