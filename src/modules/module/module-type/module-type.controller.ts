import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ModuleTypeService } from './module-type.service';
import { CreateModuleTypeDto } from './dto/create-module-type.dto';
import { ModuleTypeResponseDto } from './dto/module-type-response.dto';

/**
 * Controller for managing module types
 * @description Handles HTTP requests for module type operations
 */
@ApiTags('Module Types')
@Controller('module-types')
export class ModuleTypeController {
  constructor(private readonly moduleTypeService: ModuleTypeService) {}

  /**
   * Create a new module type
   * @param createModuleTypeDto - The data for creating a new module type
   * @returns The created module type
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new module type',
    description: 'Creates a new module type with the provided data. The key must be unique.'
  })
  @ApiBody({ 
    type: CreateModuleTypeDto,
    description: 'The data for creating a new module type'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The module type has been successfully created.',
    type: ModuleTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A module type with the same key already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided data is invalid.',
  })
  async create(@Body() createModuleTypeDto: CreateModuleTypeDto): Promise<ModuleTypeResponseDto> {
    return this.moduleTypeService.create(createModuleTypeDto);
  }

  /**
   * Get all active module types
   * @returns Array of module types
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get all module types',
    description: 'Retrieves all active module types, sorted by name.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all module types.',
    type: [ModuleTypeResponseDto],
  })
  async findAll(): Promise<ModuleTypeResponseDto[]> {
    return this.moduleTypeService.findAll();
  }

  /**
   * Get a module type by ID
   * @param motuid - The unique identifier of the module type
   * @returns The module type
   */
  @Get(':motuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get a module type by ID',
    description: 'Retrieves a specific module type by its unique identifier.'
  })
  @ApiParam({
    name: 'motuid',
    description: 'The unique identifier of the module type',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the module type.',
    type: ModuleTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The module type was not found.',
  })
  async findOne(@Param('motuid') motuid: string): Promise<ModuleTypeResponseDto> {
    return this.moduleTypeService.findOne(motuid);
  }

  /**
   * Update a module type
   * @param motuid - The unique identifier of the module type
   * @param updateModuleTypeDto - The data to update
   * @returns The updated module type
   */
  @Patch(':motuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Update a module type',
    description: 'Updates a specific module type with the provided data.'
  })
  @ApiParam({
    name: 'motuid',
    description: 'The unique identifier of the module type',
    type: String,
  })
  @ApiBody({ 
    type: CreateModuleTypeDto,
    description: 'The data to update the module type'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The module type has been successfully updated.',
    type: ModuleTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The module type was not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A module type with the same key already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided data is invalid.',
  })
  async update(
    @Param('motuid') motuid: string,
    @Body() updateModuleTypeDto: Partial<CreateModuleTypeDto>,
  ): Promise<ModuleTypeResponseDto> {
    return this.moduleTypeService.update(motuid, updateModuleTypeDto);
  }

  /**
   * Delete a module type
   * @param motuid - The unique identifier of the module type
   * @returns The deleted module type
   */
  @Delete(':motuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete a module type',
    description: 'Deletes a specific module type. Cannot delete if it has associated modules.'
  })
  @ApiParam({
    name: 'motuid',
    description: 'The unique identifier of the module type',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The module type has been successfully deleted.',
    type: ModuleTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The module type was not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Cannot delete module type that has associated modules.',
  })
  async remove(@Param('motuid') motuid: string): Promise<ModuleTypeResponseDto> {
    return this.moduleTypeService.remove(motuid);
  }
} 