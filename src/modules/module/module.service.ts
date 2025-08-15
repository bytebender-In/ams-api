import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { ModuleResponseDto } from './dto/module-response.dto';
import { DatabaseService } from '@/core/database/database.service';
import { generateEntityId, IdPrefix, isValidId } from '@/common/utils/uid.utils';

/**
 * Service for managing modules
 * @description Handles CRUD operations for modules with proper validation and error handling
 */
@Injectable()
export class ModuleService {
  private readonly logger = new Logger(ModuleService.name);

  constructor(private db: DatabaseService) {}

  /**
   * Transform Prisma model to response DTO
   * @param prismaModel - The Prisma model instance
   * @returns ModuleResponseDto
   */
  private transformToDto(prismaModel: any): ModuleResponseDto {
    return {
      ...prismaModel,
      description: prismaModel.description ?? undefined,
      icon: prismaModel.icon ?? undefined,
      parent_id: prismaModel.parent_id ?? undefined,
      parent: prismaModel.parent ? {
        mouid: prismaModel.parent.mouid,
        module_key: prismaModel.parent.module_key,
        name: prismaModel.parent.name
      } : undefined
    };
  }

  /**
   * Create a new module
   * @param createModuleDto - The data for creating a new module
   * @throws ConflictException if a module with the same key already exists
   * @throws BadRequestException if the input data is invalid
   * @returns Promise<ModuleResponseDto>
   */
  async create(createModuleDto: CreateModuleDto): Promise<ModuleResponseDto> {
    try {
      // Validate IDs
      if (!isValidId(createModuleDto.type_id)) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid module type ID format',
          error: {
            code: 'INVALID_ID',
            details: {
              message: 'The module type ID must be in the format mot_<21 characters>',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        });
      }

      if (createModuleDto.parent_id && !isValidId(createModuleDto.parent_id)) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid parent module ID format',
          error: {
            code: 'INVALID_ID',
            details: {
              message: 'The parent module ID must be in the format mod_<21 characters>',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        });
      }

      // Check if module with same key exists
      const existingModule = await this.db.module.findUnique({
        where: { module_key: createModuleDto.module_key }
      });

      if (existingModule) {
        throw new ConflictException({
          success: false,
          message: `Module with key ${createModuleDto.module_key} already exists`,
          error: {
            code: 'DUPLICATE_KEY',
            details: {
              message: 'A module with this key already exists',
              error: 'Conflict',
              statusCode: 409,
            },
          },
        });
      }

      // Verify module type exists
      const moduleType = await this.db.moduleType.findUnique({
        where: { motuid: createModuleDto.type_id }
      });

      if (!moduleType) {
        throw new NotFoundException({
          success: false,
          message: `Module type with ID ${createModuleDto.type_id} not found`,
          error: {
            code: 'NOT_FOUND',
            details: {
              message: 'The specified module type does not exist',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        });
      }

      // If parent_id is provided, verify parent module exists
      if (createModuleDto.parent_id) {
        const parentModule = await this.db.module.findUnique({
          where: { mouid: createModuleDto.parent_id }
        });

        if (!parentModule) {
          throw new NotFoundException({
            success: false,
            message: `Parent module with ID ${createModuleDto.parent_id} not found`,
            error: {
              code: 'NOT_FOUND',
              details: {
                message: 'The specified parent module does not exist',
                error: 'Not Found',
                statusCode: 404,
              },
            },
          });
        }
      }

      // Generate a unique ID for the module
      const mouid = generateEntityId(IdPrefix.MODULE);

      const module = await this.db.module.create({
        data: {
          ...createModuleDto,
          mouid,
          is_active: true
        },
        include: {
          type: true,
          parent: {
            select: {
              mouid: true,
              module_key: true,
              name: true
            }
          }
        }
      });

      this.logger.log(`Created new module: ${module.module_key}`);
      return this.transformToDto(module);
    } catch (error) {
      this.logger.error(`Error creating module: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get all active modules
   * @returns Promise<ModuleResponseDto[]>
   */
  async findAll(): Promise<ModuleResponseDto[]> {
    try {
      const modules = await this.db.module.findMany({
        where: { is_active: true },
        include: {
          type: true,
          parent: {
            select: {
              mouid: true,
              module_key: true,
              name: true
            }
          }
        },
        orderBy: { name: 'asc' }
      });
      return modules.map(this.transformToDto);
    } catch (error) {
      this.logger.error(`Error fetching modules: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get a module by ID
   * @param mouid - The unique identifier of the module
   * @throws NotFoundException if the module is not found
   * @returns Promise<ModuleResponseDto>
   */
  async findOne(mouid: string): Promise<ModuleResponseDto> {
    try {
      if (!isValidId(mouid)) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid module ID format',
          error: {
            code: 'INVALID_ID',
            details: {
              message: 'The module ID must be in the format mod_<21 characters>',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        });
      }

      const module = await this.db.module.findUnique({
        where: { mouid },
        include: {
          type: true,
          parent: {
            select: {
              mouid: true,
              module_key: true,
              name: true
            }
          }
        }
      });

      if (!module) {
        throw new NotFoundException({
          success: false,
          message: `Module with ID ${mouid} not found`,
          error: {
            code: 'NOT_FOUND',
            details: {
              message: 'The requested module does not exist',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        });
      }

      return this.transformToDto(module);
    } catch (error) {
      this.logger.error(`Error fetching module ${mouid}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Update a module
   * @param mouid - The unique identifier of the module to update
   * @param updateModuleDto - The data to update
   * @throws NotFoundException if the module is not found
   * @throws ConflictException if updating the key would create a conflict
   * @returns Promise<ModuleResponseDto>
   */
  async update(mouid: string, updateModuleDto: Partial<CreateModuleDto>): Promise<ModuleResponseDto> {
    try {
      if (!isValidId(mouid)) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid module ID format',
          error: {
            code: 'INVALID_ID',
            details: {
              message: 'The module ID must be in the format mod_<21 characters>',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        });
      }

      // Check if module exists
      await this.findOne(mouid);

      // If key is being updated, check for conflicts
      if (updateModuleDto.module_key) {
        const existingModule = await this.db.module.findUnique({
          where: { module_key: updateModuleDto.module_key }
        });

        if (existingModule && existingModule.mouid !== mouid) {
          throw new ConflictException({
            success: false,
            message: `Module with key ${updateModuleDto.module_key} already exists`,
            error: {
              code: 'DUPLICATE_KEY',
              details: {
                message: 'A module with this key already exists',
                error: 'Conflict',
                statusCode: 409,
              },
            },
          });
        }
      }

      // If type_id is being updated, verify module type exists
      if (updateModuleDto.type_id) {
        if (!isValidId(updateModuleDto.type_id)) {
          throw new BadRequestException({
            success: false,
            message: 'Invalid module type ID format',
            error: {
              code: 'INVALID_ID',
              details: {
                message: 'The module type ID must be in the format mot_<21 characters>',
                error: 'Bad Request',
                statusCode: 400,
              },
            },
          });
        }

        const moduleType = await this.db.moduleType.findUnique({
          where: { motuid: updateModuleDto.type_id }
        });

        if (!moduleType) {
          throw new NotFoundException({
            success: false,
            message: `Module type with ID ${updateModuleDto.type_id} not found`,
            error: {
              code: 'NOT_FOUND',
              details: {
                message: 'The specified module type does not exist',
                error: 'Not Found',
                statusCode: 404,
              },
            },
          });
        }
      }

      // If parent_id is being updated, verify parent module exists
      if (updateModuleDto.parent_id) {
        if (!isValidId(updateModuleDto.parent_id)) {
          throw new BadRequestException({
            success: false,
            message: 'Invalid parent module ID format',
            error: {
              code: 'INVALID_ID',
              details: {
                message: 'The parent module ID must be in the format mod_<21 characters>',
                error: 'Bad Request',
                statusCode: 400,
              },
            },
          });
        }

        const parentModule = await this.db.module.findUnique({
          where: { mouid: updateModuleDto.parent_id }
        });

        if (!parentModule) {
          throw new NotFoundException({
            success: false,
            message: `Parent module with ID ${updateModuleDto.parent_id} not found`,
            error: {
              code: 'NOT_FOUND',
              details: {
                message: 'The specified parent module does not exist',
                error: 'Not Found',
                statusCode: 404,
              },
            },
          });
        }
      }

      const updatedModule = await this.db.module.update({
        where: { mouid },
        data: updateModuleDto,
        include: {
          type: true,
          parent: {
            select: {
              mouid: true,
              module_key: true,
              name: true
            }
          }
        }
      });

      this.logger.log(`Updated module: ${updatedModule.module_key}`);
      return this.transformToDto(updatedModule);
    } catch (error) {
      this.logger.error(`Error updating module ${mouid}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete a module
   * @param mouid - The unique identifier of the module to delete
   * @throws NotFoundException if the module is not found
   * @throws ConflictException if the module has associated children
   * @returns Promise<ModuleResponseDto>
   */
  async remove(mouid: string): Promise<ModuleResponseDto> {
    try {
      if (!isValidId(mouid)) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid module ID format',
          error: {
            code: 'INVALID_ID',
            details: {
              message: 'The module ID must be in the format mod_<21 characters>',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        });
      }

      // Check if module exists
      await this.findOne(mouid);

      // Check if there are any child modules
      const children = await this.db.module.findMany({
        where: { parent_id: mouid }
      });

      if (children.length > 0) {
        throw new ConflictException({
          success: false,
          message: 'Cannot delete module that has child modules',
          error: {
            code: 'DEPENDENCY_EXISTS',
            details: {
              message: 'This module has child modules that must be removed first',
              error: 'Conflict',
              statusCode: 409,
              affectedModules: children.length,
            },
          },
        });
      }

      const deletedModule = await this.db.module.delete({
        where: { mouid },
        include: {
          type: true,
          parent: {
            select: {
              mouid: true,
              module_key: true,
              name: true
            }
          }
        }
      });

      this.logger.log(`Deleted module: ${deletedModule.module_key}`);
      return this.transformToDto(deletedModule);
    } catch (error) {
      this.logger.error(`Error deleting module ${mouid}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Update a module's parent relationship
   * @param mouid - The ID of the module to update
   * @param newParentId - Optional new parent ID (if null, makes it a standalone module)
   * @throws NotFoundException if the module or new parent is not found
   * @throws BadRequestException if the new parent would create a circular reference
   * @returns Promise<ModuleResponseDto>
   */
  async updateParent(mouid: string, newParentId?: string): Promise<ModuleResponseDto> {
    try {
      // Validate module ID format
      if (!isValidId(mouid)) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid module ID format',
          error: {
            code: 'INVALID_ID',
            details: {
              message: 'The module ID must be in the format mod_<21 characters>',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        });
      }

      // Check if module exists
      const module = await this.db.module.findUnique({
        where: { mouid }
      });

      if (!module) {
        throw new NotFoundException({
          success: false,
          message: `Module with ID ${mouid} not found`,
          error: {
            code: 'NOT_FOUND',
            details: {
              message: 'The specified module does not exist',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        });
      }

      // If new parent ID is provided, validate it
      if (newParentId) {
        if (!isValidId(newParentId)) {
          throw new BadRequestException({
            success: false,
            message: 'Invalid parent module ID format',
            error: {
              code: 'INVALID_ID',
              details: {
                message: 'The parent module ID must be in the format mod_<21 characters>',
                error: 'Bad Request',
                statusCode: 400,
              },
            },
          });
        }

        // Check if new parent exists
        const newParent = await this.db.module.findUnique({
          where: { mouid: newParentId }
        });

        if (!newParent) {
          throw new NotFoundException({
            success: false,
            message: `Parent module with ID ${newParentId} not found`,
            error: {
              code: 'NOT_FOUND',
              details: {
                message: 'The specified parent module does not exist',
                error: 'Not Found',
                statusCode: 404,
              },
            },
          });
        }

        // Check for circular reference
        if (newParentId === mouid) {
          throw new BadRequestException({
            success: false,
            message: 'A module cannot be its own parent',
            error: {
              code: 'INVALID_PARENT',
              details: {
                message: 'Circular reference detected',
                error: 'Bad Request',
                statusCode: 400,
              },
            },
          });
        }

        // Check if new parent is not a descendant of the current module
        let currentParent = await this.db.module.findUnique({
          where: { mouid: newParentId },
          select: { parent_id: true }
        });

        while (currentParent?.parent_id) {
          if (currentParent.parent_id === mouid) {
            throw new BadRequestException({
              success: false,
              message: 'Circular reference detected',
              error: {
                code: 'INVALID_PARENT',
                details: {
                  message: 'The new parent is a descendant of the current module',
                  error: 'Bad Request',
                  statusCode: 400,
                },
              },
            });
          }
          currentParent = await this.db.module.findUnique({
            where: { mouid: currentParent.parent_id },
            select: { parent_id: true }
          });
        }
      }

      // Update the module's parent
      const updatedModule = await this.db.module.update({
        where: { mouid },
        data: { parent_id: newParentId || null }
      });

      this.logger.log(`Updated parent for module ${mouid} to ${newParentId || 'none'}`);
      return this.transformToDto(updatedModule);
    } catch (error) {
      this.logger.error(`Error updating module parent: ${error.message}`, error.stack);
      throw error;
    }
  }
} 