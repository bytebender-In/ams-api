import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ModuleFeatureService } from './module-feature.service';
import { CreateModuleFeatureDto } from './dto/create-module-feature.dto';
import { ModuleFeatureResponseDto } from './dto/module-feature-response.dto';

@ApiTags('Modules')
@Controller('modules/:moduleId/features')
export class ModuleFeatureController {
  constructor(private readonly moduleFeatureService: ModuleFeatureService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module feature' })
  @ApiResponse({
    status: 201,
    description: 'The feature has been successfully created.',
    type: ModuleFeatureResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  @ApiResponse({ status: 409, description: 'Feature with this key already exists.' })
  create(
    @Param('moduleId') moduleId: string,
    @Body() createModuleFeatureDto: CreateModuleFeatureDto
  ): Promise<ModuleFeatureResponseDto> {
    return this.moduleFeatureService.create(moduleId, createModuleFeatureDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all features for a module' })
  @ApiResponse({
    status: 200,
    description: 'List of all features for the module.',
    type: [ModuleFeatureResponseDto]
  })
  @ApiResponse({ status: 404, description: 'Module not found.' })
  findAll(@Param('moduleId') moduleId: string): Promise<ModuleFeatureResponseDto[]> {
    return this.moduleFeatureService.findAll(moduleId);
  }

  @Get(':featureId')
  @ApiOperation({ summary: 'Get a specific feature' })
  @ApiResponse({
    status: 200,
    description: 'The requested feature.',
    type: ModuleFeatureResponseDto
  })
  @ApiResponse({ status: 404, description: 'Feature not found.' })
  findOne(@Param('featureId') featureId: string): Promise<ModuleFeatureResponseDto> {
    return this.moduleFeatureService.findOne(featureId);
  }

  @Patch(':featureId')
  @ApiOperation({ summary: 'Update a feature' })
  @ApiResponse({
    status: 200,
    description: 'The feature has been successfully updated.',
    type: ModuleFeatureResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Feature not found.' })
  @ApiResponse({ status: 409, description: 'Feature with this key already exists.' })
  update(
    @Param('featureId') featureId: string,
    @Body() updateFeatureDto: Partial<CreateModuleFeatureDto>
  ): Promise<ModuleFeatureResponseDto> {
    return this.moduleFeatureService.update(featureId, updateFeatureDto);
  }

  @Delete(':featureId')
  @ApiOperation({ summary: 'Delete a feature' })
  @ApiResponse({
    status: 200,
    description: 'The feature has been successfully deleted.',
    type: ModuleFeatureResponseDto
  })
  @ApiResponse({ status: 404, description: 'Feature not found.' })
  remove(@Param('featureId') featureId: string): Promise<ModuleFeatureResponseDto> {
    return this.moduleFeatureService.remove(featureId);
  }
} 