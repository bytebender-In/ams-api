import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { CreateModuleTypeDto } from './dto/create-module-type.dto';
import { ModuleTypeResponseDto } from './dto/module-type-response.dto';
import { DatabaseService } from '@/core/database/database.service';
import { generateEntityId, IdPrefix } from '@/common/utils/uid.utils';

/**
 * Service for managing module types
 * @description Handles CRUD operations for module types with proper validation and error handling
 */
@Injectable()
export class ModuleTypeService {
  private readonly logger = new Logger(ModuleTypeService.name);

  constructor(private db: DatabaseService) {}

  /**
   * Transform Prisma model to response DTO
   * @param prismaModel - The Prisma model instance
   * @returns ModuleTypeResponseDto
   */
  private transformToDto(prismaModel: any): ModuleTypeResponseDto {
    return {
      ...prismaModel,
      description: prismaModel.description ?? undefined,
      category: prismaModel.category ?? undefined
    };
  }

  /**
   * Create a new module type
   * @param createModuleTypeDto - The data for creating a new module type
   * @throws ConflictException if a module type with the same key already exists
   * @throws BadRequestException if the input data is invalid
   * @returns Promise<ModuleTypeResponseDto>
   */
  async create(createModuleTypeDto: CreateModuleTypeDto): Promise<ModuleTypeResponseDto> {
    try {
      // Check if module type with same key exists
      const existingType = await this.db.moduleType.findUnique({
        where: { key: createModuleTypeDto.key }
      });

      if (existingType) {
        throw new ConflictException({
          success: false,
          message: `Module type with key ${createModuleTypeDto.key} already exists`,
          error: {
            code: 'DUPLICATE_KEY',
            details: {
              message: 'A module type with this key already exists',
              error: 'Conflict',
              statusCode: 409,
            },
          },
        });
      }

      // Generate a unique ID for the module type
      const motuid = generateEntityId(IdPrefix.MODULE_TYPE);

      const moduleType = await this.db.moduleType.create({
        data: {
          ...createModuleTypeDto,
          motuid,
          is_active: true
        }
      });

      this.logger.log(`Created new module type: ${moduleType.key}`);
      return this.transformToDto(moduleType);
    } catch (error) {
      this.logger.error(`Error creating module type: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get all active module types
   * @returns Promise<ModuleTypeResponseDto[]>
   */
  async findAll(): Promise<ModuleTypeResponseDto[]> {
    try {
      const moduleTypes = await this.db.moduleType.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
      });
      return moduleTypes.map(this.transformToDto);
    } catch (error) {
      this.logger.error(`Error fetching module types: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get a module type by ID
   * @param motuid - The unique identifier of the module type
   * @throws NotFoundException if the module type is not found
   * @returns Promise<ModuleTypeResponseDto>
   */
  async findOne(motuid: string): Promise<ModuleTypeResponseDto> {
    try {
      const moduleType = await this.db.moduleType.findUnique({
        where: { motuid }
      });

      if (!moduleType) {
        throw new NotFoundException({
          success: false,
          message: `Module type with ID ${motuid} not found`,
          error: {
            code: 'NOT_FOUND',
            details: {
              message: 'The requested module type does not exist',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        });
      }

      return this.transformToDto(moduleType);
    } catch (error) {
      this.logger.error(`Error fetching module type ${motuid}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Update a module type
   * @param motuid - The unique identifier of the module type to update
   * @param updateModuleTypeDto - The data to update
   * @throws NotFoundException if the module type is not found
   * @throws ConflictException if updating the key would create a conflict
   * @returns Promise<ModuleTypeResponseDto>
   */
  async update(motuid: string, updateModuleTypeDto: Partial<CreateModuleTypeDto>): Promise<ModuleTypeResponseDto> {
    try {
      // Check if module type exists
      await this.findOne(motuid);

      // If key is being updated, check for conflicts
      if (updateModuleTypeDto.key) {
        const existingType = await this.db.moduleType.findUnique({
          where: { key: updateModuleTypeDto.key }
        });

        if (existingType && existingType.motuid !== motuid) {
          throw new ConflictException({
            success: false,
            message: `Module type with key ${updateModuleTypeDto.key} already exists`,
            error: {
              code: 'DUPLICATE_KEY',
              details: {
                message: 'A module type with this key already exists',
                error: 'Conflict',
                statusCode: 409,
              },
            },
          });
        }
      }

      const updatedType = await this.db.moduleType.update({
        where: { motuid },
        data: updateModuleTypeDto
      });

      this.logger.log(`Updated module type: ${updatedType.key}`);
      return this.transformToDto(updatedType);
    } catch (error) {
      this.logger.error(`Error updating module type ${motuid}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete a module type
   * @param motuid - The unique identifier of the module type to delete
   * @throws NotFoundException if the module type is not found
   * @throws ConflictException if the module type has associated modules
   * @returns Promise<ModuleTypeResponseDto>
   */
  async remove(motuid: string): Promise<ModuleTypeResponseDto> {
    try {
      // Check if module type exists
      await this.findOne(motuid);

      // Check if there are any modules using this type
      const modules = await this.db.module.findMany({
        where: { type_id: motuid }
      });

      if (modules.length > 0) {
        throw new ConflictException({
          success: false,
          message: 'Cannot delete module type that has associated modules',
          error: {
            code: 'DEPENDENCY_EXISTS',
            details: {
              message: 'This module type has associated modules that must be removed first',
              error: 'Conflict',
              statusCode: 409,
              affectedModules: modules.length,
            },
          },
        });
      }

      const deletedType = await this.db.moduleType.delete({
        where: { motuid }
      });

      this.logger.log(`Deleted module type: ${deletedType.key}`);
      return this.transformToDto(deletedType);
    } catch (error) {
      this.logger.error(`Error deleting module type ${motuid}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 