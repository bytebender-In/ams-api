import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { CreateModuleFeatureDto } from './dto/create-module-feature.dto';
import { ModuleFeatureResponseDto } from './dto/module-feature-response.dto';
import { DatabaseService } from '@/core/database/database.service';
import { generateEntityId, IdPrefix, isValidId } from '@/common/utils/uid.utils';

/**
 * Service for managing module features
 * @description Handles CRUD operations for module features with proper validation and error handling
 */
@Injectable()
export class ModuleFeatureService {
  private readonly logger = new Logger(ModuleFeatureService.name);

  constructor(private db: DatabaseService) {}

  /**
   * Transform Prisma model to response DTO
   * @param prismaModel - The Prisma model instance
   * @returns ModuleFeatureResponseDto
   */
  private transformToDto(prismaModel: any): ModuleFeatureResponseDto {
    return {
      ...prismaModel,
      metadata: prismaModel.metadata ?? undefined
    };
  }

  /**
   * Create a new module feature
   * @param moduleId - The ID of the module to add the feature to
   * @param createModuleFeatureDto - The data for creating a new feature
   * @throws NotFoundException if the module is not found
   * @throws ConflictException if a feature with the same key already exists
   * @returns Promise<ModuleFeatureResponseDto>
   */
  async create(moduleId: string, createModuleFeatureDto: CreateModuleFeatureDto): Promise<ModuleFeatureResponseDto> {
    try {
      // Validate module ID format
      if (!isValidId(moduleId)) {
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

      // Verify module exists
      const module = await this.db.module.findUnique({
        where: { mouid: moduleId }
      });

      if (!module) {
        throw new NotFoundException({
          success: false,
          message: `Module with ID ${moduleId} not found`,
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

      // Check if feature with same key exists for this module
      const existingFeature = await this.db.moduleFeature.findFirst({
        where: {
          module_id: moduleId,
          feature_key: createModuleFeatureDto.feature_key
        }
      });

      if (existingFeature) {
        throw new ConflictException({
          success: false,
          message: `Feature with key ${createModuleFeatureDto.feature_key} already exists for this module`,
          error: {
            code: 'DUPLICATE_KEY',
            details: {
              message: 'A feature with this key already exists for this module',
              error: 'Conflict',
              statusCode: 409,
            },
          },
        });
      }

      // Generate a unique ID for the feature
      const mofuid = generateEntityId(IdPrefix.MODULE_FEATURE);

      const feature = await this.db.moduleFeature.create({
        data: {
          ...createModuleFeatureDto,
          mofuid,
          module_id: moduleId,
          is_enabled: createModuleFeatureDto.is_enabled ?? true,
          priority: createModuleFeatureDto.priority ?? 1
        }
      });

      this.logger.log(`Created new feature ${feature.feature_key} for module ${moduleId}`);
      return this.transformToDto(feature);
    } catch (error) {
      this.logger.error(`Error creating module feature: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get all features for a module
   * @param moduleId - The ID of the module
   * @throws NotFoundException if the module is not found
   * @returns Promise<ModuleFeatureResponseDto[]>
   */
  async findAll(moduleId: string): Promise<ModuleFeatureResponseDto[]> {
    try {
      // Validate module ID format
      if (!isValidId(moduleId)) {
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

      // Verify module exists
      const module = await this.db.module.findUnique({
        where: { mouid: moduleId }
      });

      if (!module) {
        throw new NotFoundException({
          success: false,
          message: `Module with ID ${moduleId} not found`,
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

      const features = await this.db.moduleFeature.findMany({
        where: { module_id: moduleId },
        orderBy: [
          { priority: 'asc' },
          { feature_key: 'asc' }
        ]
      });

      return features.map(this.transformToDto);
    } catch (error) {
      this.logger.error(`Error fetching module features: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Get a feature by ID
   * @param featureId - The ID of the feature
   * @throws NotFoundException if the feature is not found
   * @returns Promise<ModuleFeatureResponseDto>
   */
  async findOne(featureId: string): Promise<ModuleFeatureResponseDto> {
    try {
      // Validate feature ID format
      if (!isValidId(featureId)) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid feature ID format',
          error: {
            code: 'INVALID_ID',
            details: {
              message: 'The feature ID must be in the format mof_<21 characters>',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        });
      }

      const feature = await this.db.moduleFeature.findUnique({
        where: { mofuid: featureId }
      });

      if (!feature) {
        throw new NotFoundException({
          success: false,
          message: `Feature with ID ${featureId} not found`,
          error: {
            code: 'NOT_FOUND',
            details: {
              message: 'The requested feature does not exist',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        });
      }

      return this.transformToDto(feature);
    } catch (error) {
      this.logger.error(`Error fetching feature ${featureId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Update a feature
   * @param featureId - The ID of the feature to update
   * @param updateFeatureDto - The data to update
   * @throws NotFoundException if the feature is not found
   * @throws ConflictException if updating the key would create a conflict
   * @returns Promise<ModuleFeatureResponseDto>
   */
  async update(featureId: string, updateFeatureDto: Partial<CreateModuleFeatureDto>): Promise<ModuleFeatureResponseDto> {
    try {
      // Validate feature ID format
      if (!isValidId(featureId)) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid feature ID format',
          error: {
            code: 'INVALID_ID',
            details: {
              message: 'The feature ID must be in the format mof_<21 characters>',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        });
      }

      // Check if feature exists
      const feature = await this.db.moduleFeature.findUnique({
        where: { mofuid: featureId }
      });

      if (!feature) {
        throw new NotFoundException({
          success: false,
          message: `Feature with ID ${featureId} not found`,
          error: {
            code: 'NOT_FOUND',
            details: {
              message: 'The requested feature does not exist',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        });
      }

      // If key is being updated, check for conflicts
      if (updateFeatureDto.feature_key) {
        const existingFeature = await this.db.moduleFeature.findFirst({
          where: {
            module_id: feature.module_id,
            feature_key: updateFeatureDto.feature_key,
            mofuid: { not: featureId }
          }
        });

        if (existingFeature) {
          throw new ConflictException({
            success: false,
            message: `Feature with key ${updateFeatureDto.feature_key} already exists for this module`,
            error: {
              code: 'DUPLICATE_KEY',
              details: {
                message: 'A feature with this key already exists for this module',
                error: 'Conflict',
                statusCode: 409,
              },
            },
          });
        }
      }

      const updatedFeature = await this.db.moduleFeature.update({
        where: { mofuid: featureId },
        data: updateFeatureDto
      });

      this.logger.log(`Updated feature ${updatedFeature.feature_key}`);
      return this.transformToDto(updatedFeature);
    } catch (error) {
      this.logger.error(`Error updating feature ${featureId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Delete a feature
   * @param featureId - The ID of the feature to delete
   * @throws NotFoundException if the feature is not found
   * @returns Promise<ModuleFeatureResponseDto>
   */
  async remove(featureId: string): Promise<ModuleFeatureResponseDto> {
    try {
      // Validate feature ID format
      if (!isValidId(featureId)) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid feature ID format',
          error: {
            code: 'INVALID_ID',
            details: {
              message: 'The feature ID must be in the format mof_<21 characters>',
              error: 'Bad Request',
              statusCode: 400,
            },
          },
        });
      }

      // Check if feature exists
      const feature = await this.db.moduleFeature.findUnique({
        where: { mofuid: featureId }
      });

      if (!feature) {
        throw new NotFoundException({
          success: false,
          message: `Feature with ID ${featureId} not found`,
          error: {
            code: 'NOT_FOUND',
            details: {
              message: 'The requested feature does not exist',
              error: 'Not Found',
              statusCode: 404,
            },
          },
        });
      }

      const deletedFeature = await this.db.moduleFeature.delete({
        where: { mofuid: featureId }
      });

      this.logger.log(`Deleted feature ${deletedFeature.feature_key}`);
      return this.transformToDto(deletedFeature);
    } catch (error) {
      this.logger.error(`Error deleting feature ${featureId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 