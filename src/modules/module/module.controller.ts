import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { ModuleResponseDto } from './dto/module-response.dto';
import { UpdateModuleParentDto } from './dto/update-module-parent.dto';

/**
 * Controller for managing modules
 * @description Handles HTTP requests for module operations
 */
@ApiTags('Modules')
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  /**
   * Create a new module
   * @param createModuleDto - The data for creating a new module
   * @returns The created module
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new module',
    description: 'Creates a new module with the provided data. The module_key must be unique.'
  })
  @ApiBody({ 
    type: CreateModuleDto,
    description: 'The data for creating a new module'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The module has been successfully created.',
    type: ModuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A module with the same key already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided data is invalid.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified module type or parent module does not exist.',
  })
  async create(@Body() createModuleDto: CreateModuleDto): Promise<ModuleResponseDto> {
    return this.moduleService.create(createModuleDto);
  }

  /**
   * Get all active modules
   * @returns Array of modules
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get all modules',
    description: 'Retrieves all active modules, sorted by name.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all modules.',
    type: [ModuleResponseDto],
  })
  async findAll(): Promise<ModuleResponseDto[]> {
    return this.moduleService.findAll();
  }

  /**
   * Get a module by ID
   * @param mouid - The unique identifier of the module
   * @returns The module
   */
  @Get(':mouid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get a module by ID',
    description: 'Retrieves a specific module by its unique identifier.'
  })
  @ApiParam({
    name: 'mouid',
    description: 'The unique identifier of the module',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the module.',
    type: ModuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The module was not found.',
  })
  async findOne(@Param('mouid') mouid: string): Promise<ModuleResponseDto> {
    return this.moduleService.findOne(mouid);
  }

  /**
   * Update a module
   * @param mouid - The unique identifier of the module
   * @param updateModuleDto - The data to update
   * @returns The updated module
   */
  @Patch(':mouid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Update a module',
    description: 'Updates a specific module with the provided data.'
  })
  @ApiParam({
    name: 'mouid',
    description: 'The unique identifier of the module',
    type: String,
  })
  @ApiBody({ 
    type: CreateModuleDto,
    description: 'The data to update the module'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The module has been successfully updated.',
    type: ModuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The module was not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A module with the same key already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided data is invalid.',
  })
  async update(
    @Param('mouid') mouid: string,
    @Body() updateModuleDto: Partial<CreateModuleDto>,
  ): Promise<ModuleResponseDto> {
    return this.moduleService.update(mouid, updateModuleDto);
  }

  /**
   * Delete a module
   * @param mouid - The unique identifier of the module
   * @returns The deleted module
   */
  @Delete(':mouid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete a module',
    description: 'Deletes a specific module. Cannot delete if it has child modules.'
  })
  @ApiParam({
    name: 'mouid',
    description: 'The unique identifier of the module',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The module has been successfully deleted.',
    type: ModuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The module was not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Cannot delete module that has child modules.',
  })
  async remove(@Param('mouid') mouid: string): Promise<ModuleResponseDto> {
    return this.moduleService.remove(mouid);
  }

  @Patch(':mouid/parent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Update a module\'s parent relationship',
    description: 'Updates the parent relationship of a module. Can make it standalone or assign to a new parent.'
  })
  @ApiParam({
    name: 'mouid',
    description: 'The unique identifier of the module',
    type: String,
    required: true
  })
  @ApiBody({ 
    type: UpdateModuleParentDto,
    description: 'The data for updating the module\'s parent relationship',
    required: true,
    schema: {
      type: 'object',
      properties: {
        parent_id: {
          type: 'string',
          description: 'The ID of the new parent module. If omitted, makes the module standalone.',
          example: 'mod_123456789abcdefghijk',
          nullable: true
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The module\'s parent has been successfully updated.',
    type: ModuleResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data or circular reference detected.' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Module or parent module not found.' 
  })
  updateParent(
    @Param('mouid') mouid: string,
    @Body() updateParentDto: UpdateModuleParentDto
  ): Promise<ModuleResponseDto> {
    return this.moduleService.updateParent(mouid, updateParentDto.parent_id);
  }
} 