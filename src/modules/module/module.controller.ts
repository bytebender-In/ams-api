import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ModuleService } from './module.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { ModuleResponseDto } from './dto/module-response.dto';
import { ApiResponse } from '../../common/interfaces/api-response.interface';

@ApiTags('modules')
@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new module' })
  @SwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'The module has been successfully created.',
    type: ModuleResponseDto,
  })
  @SwaggerResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async create(@Body() createModuleDto: CreateModuleDto): Promise<ApiResponse<ModuleResponseDto>> {
    const module = await this.moduleService.create(createModuleDto);
    return {
      success: true,
      message: 'Module created successfully',
      data: module,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all modules' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Return all modules.',
    type: [ModuleResponseDto],
  })
  async findAll(): Promise<ApiResponse<ModuleResponseDto[]>> {
    const modules = await this.moduleService.findAll();
    return {
      success: true,
      message: 'Modules retrieved successfully',
      data: modules,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a module by id' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Return the module.',
    type: ModuleResponseDto,
  })
  @SwaggerResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found.',
  })
  async findOne(@Param('id') id: string): Promise<ApiResponse<ModuleResponseDto>> {
    const module = await this.moduleService.findOne(id);
    return {
      success: true,
      message: 'Module retrieved successfully',
      data: module,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a module' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'The module has been successfully updated.',
    type: ModuleResponseDto,
  })
  @SwaggerResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateModuleDto: Partial<CreateModuleDto>,
  ): Promise<ApiResponse<ModuleResponseDto>> {
    const module = await this.moduleService.update(id, updateModuleDto);
    return {
      success: true,
      message: 'Module updated successfully',
      data: module,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a module' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'The module has been successfully deleted.',
    type: ModuleResponseDto,
  })
  @SwaggerResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Module not found.',
  })
  async remove(@Param('id') id: string): Promise<ApiResponse<ModuleResponseDto>> {
    const module = await this.moduleService.remove(id);
    return {
      success: true,
      message: 'Module deleted successfully',
      data: module,
    };
  }
} 