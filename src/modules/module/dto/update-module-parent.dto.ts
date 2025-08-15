import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';

/**
 * Data Transfer Object for updating a module's parent relationship
 * @description Represents the structure and validation rules for updating a module's parent
 */
export class UpdateModuleParentDto {
  @ApiPropertyOptional({
    description: 'The ID of the new parent module. If omitted, makes the module standalone.',
    example: 'mod_123456789abcdefghijk',
    nullable: true,
    required: false,
    default: null
  })
  @IsOptional()
  @Matches(/^mod_[a-zA-Z0-9]{21}$/, {
    message: 'Parent ID must be in the format mod_<21 characters>'
  })
  parent_id?: string;
} 