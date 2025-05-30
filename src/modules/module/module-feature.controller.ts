import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ModuleFeatureService } from './module-feature.service';
import { CreateModuleFeatureDto } from './dto/create-module-feature.dto';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { ModuleFeatureResponseDto } from './dto/module-response.dto';
import { ApiResponse } from '../../common/interfaces/api-response.interface';

@ApiTags('module-features')
@Controller('module-features')
export class ModuleFeatureController {
  constructor(private readonly moduleFeatureService: ModuleFeatureService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module feature' })
  @SwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'The module feature has been successfully created.',
    type: ModuleFeatureResponseDto,
  })
  @SwaggerResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async create(
    @Body() createModuleFeatureDto: CreateModuleFeatureDto,
  ): Promise<ApiResponse<ModuleFeatureResponseDto>> {
    const feature = await this.moduleFeatureService.create(createModuleFeatureDto);
    return {
      success: true,
      message: 'Module feature created successfully',
      data: feature,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all module features' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Return all module features.',
    type: [ModuleFeatureResponseDto],
  })
  async findAll(): Promise<ApiResponse<ModuleFeatureResponseDto[]>> {
    const features = await this.moduleFeatureService.findAll();
    return {
      success: true,
      message: 'Module features retrieved successfully',
      data: features,
    };
  }

  @Get('module/:moduleId')
  @ApiOperation({ summary: 'Get module features by module id' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Return module features for the specified module.',
    type: [ModuleFeatureResponseDto],
  })
  @SwaggerResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found.',
  })
  async findByModuleId(
    @Param('moduleId') moduleId: string,
  ): Promise<ApiResponse<ModuleFeatureResponseDto[]>> {
    const features = await this.moduleFeatureService.findByModuleId(moduleId);
    return {
      success: true,
      message: 'Module features retrieved successfully',
      data: features,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a module feature' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'The module feature has been successfully updated.',
    type: ModuleFeatureResponseDto,
  })
  @SwaggerResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module feature not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateModuleFeatureDto: Partial<CreateModuleFeatureDto>,
  ): Promise<ApiResponse<ModuleFeatureResponseDto>> {
    const feature = await this.moduleFeatureService.update(id, updateModuleFeatureDto);
    return {
      success: true,
      message: 'Module feature updated successfully',
      data: feature,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module feature' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'The module feature has been successfully deleted.',
    type: ModuleFeatureResponseDto,
  })
  @SwaggerResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module feature not found.',
  })
  async remove(@Param('id') id: string): Promise<ApiResponse<ModuleFeatureResponseDto>> {
    const feature = await this.moduleFeatureService.remove(id);
    return {
      success: true,
      message: 'Module feature deleted successfully',
      data: feature,
    };
  }
} 