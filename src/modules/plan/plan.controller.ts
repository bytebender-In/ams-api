import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

/**
 * Controller for managing plans
 * @description Handles HTTP requests for plan operations
 */
@ApiTags('Plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  /**
   * Create a new plan
   * @param createPlanDto - The data for creating a new plan
   * @returns The created plan
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new plan',
    description: 'Creates a new plan with the provided data. The name must be unique.'
  })
  @ApiBody({ 
    type: CreatePlanDto,
    description: 'The data for creating a new plan'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The plan has been successfully created.',
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A plan with the same name already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided data is invalid.',
  })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    return this.planService.create(createPlanDto);
  }

  /**
   * Get all active plans
   * @returns Array of plans
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get all plans',
    description: 'Retrieves all active plans, sorted by name.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all plans.',
    type: [PlanResponseDto],
  })
  async findAll(): Promise<PlanResponseDto[]> {
    return this.planService.findAll();
  }

  /**
   * Get a plan by ID
   * @param puid - The unique identifier of the plan
   * @returns The plan
   */
  @Get(':puid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get a plan by ID',
    description: 'Retrieves a specific plan by its unique identifier.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the plan.',
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan was not found.',
  })
  async findOne(@Param('puid') puid: string): Promise<PlanResponseDto> {
    return this.planService.findOne(puid);
  }

  /**
   * Update a plan
   * @param puid - The unique identifier of the plan
   * @param updatePlanDto - The data to update
   * @returns The updated plan
   */
  @Patch(':puid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Update a plan',
    description: 'Updates a specific plan with the provided data.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiBody({ 
    type: UpdatePlanDto,
    description: 'The data to update the plan'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The plan has been successfully updated.',
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan was not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A plan with the same name already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided data is invalid.',
  })
  async update(
    @Param('puid') puid: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    return this.planService.update(puid, updatePlanDto);
  }

  /**
   * Delete a plan
   * @param puid - The unique identifier of the plan
   * @returns The deleted plan
   */
  @Delete(':puid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete a plan',
    description: 'Deletes a specific plan. Cannot delete if it has active subscriptions.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The plan has been successfully deleted.',
    type: PlanResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan was not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Cannot delete plan that has active subscriptions.',
  })
  async remove(@Param('puid') puid: string): Promise<PlanResponseDto> {
    return this.planService.remove(puid);
  }
} 