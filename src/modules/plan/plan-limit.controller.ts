import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PlanService } from './plan.service';
import { CreatePlanLimitDto, UpdatePlanLimitDto, PlanLimitResponseDto } from './dto/plan-limit.dto';

/**
 * Controller for managing plan limits
 * @description Handles HTTP requests for plan limit operations
 */
@ApiTags('Plan Limits')
@Controller('plans/:puid/limits')
export class PlanLimitController {
  constructor(private readonly planService: PlanService) {}

  /**
   * Create a new plan limit
   * @param puid - The unique identifier of the plan
   * @param createPlanLimitDto - The data for creating a new plan limit
   * @returns The created plan limit
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new plan limit',
    description: 'Creates a new limit for a specific plan. The limit_type must be unique per plan and region.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiBody({ 
    type: CreatePlanLimitDto,
    description: 'The data for creating a new plan limit'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The plan limit has been successfully created.',
    type: PlanLimitResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A limit with the same type already exists for this plan and region.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided data is invalid.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan was not found.',
  })
  async create(
    @Param('puid') puid: string,
    @Body() createPlanLimitDto: CreatePlanLimitDto
  ): Promise<PlanLimitResponseDto> {
    return this.planService.createLimit(puid, createPlanLimitDto);
  }

  /**
   * Get all limits for a plan
   * @param puid - The unique identifier of the plan
   * @returns Array of plan limits
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get all plan limits',
    description: 'Retrieves all limits for a specific plan.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all plan limits.',
    type: [PlanLimitResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan was not found.',
  })
  async findAll(@Param('puid') puid: string): Promise<PlanLimitResponseDto[]> {
    return this.planService.findAllLimits(puid);
  }

  /**
   * Get a plan limit by ID
   * @param puid - The unique identifier of the plan
   * @param limitId - The unique identifier of the limit
   * @returns The plan limit
   */
  @Get(':limitId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get a plan limit by ID',
    description: 'Retrieves a specific limit for a plan by its ID.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiParam({
    name: 'limitId',
    description: 'The unique identifier of the limit',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the plan limit.',
    type: PlanLimitResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan or limit was not found.',
  })
  async findOne(
    @Param('puid') puid: string,
    @Param('limitId') limitId: number
  ): Promise<PlanLimitResponseDto> {
    return this.planService.findOneLimit(puid, limitId);
  }

  /**
   * Update a plan limit
   * @param puid - The unique identifier of the plan
   * @param limitId - The unique identifier of the limit
   * @param updatePlanLimitDto - The data to update
   * @returns The updated plan limit
   */
  @Patch(':limitId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Update a plan limit',
    description: 'Updates a specific limit for a plan.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiParam({
    name: 'limitId',
    description: 'The unique identifier of the limit',
    type: Number,
  })
  @ApiBody({ 
    type: UpdatePlanLimitDto,
    description: 'The data to update the plan limit'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The plan limit has been successfully updated.',
    type: PlanLimitResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan or limit was not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A limit with the same type already exists for this plan and region.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided data is invalid.',
  })
  async update(
    @Param('puid') puid: string,
    @Param('limitId') limitId: number,
    @Body() updatePlanLimitDto: UpdatePlanLimitDto
  ): Promise<PlanLimitResponseDto> {
    return this.planService.updateLimit(puid, limitId, updatePlanLimitDto);
  }

  /**
   * Delete a plan limit
   * @param puid - The unique identifier of the plan
   * @param limitId - The unique identifier of the limit
   * @returns The deleted plan limit
   */
  @Delete(':limitId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete a plan limit',
    description: 'Deletes a specific limit from a plan.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiParam({
    name: 'limitId',
    description: 'The unique identifier of the limit',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The plan limit has been successfully deleted.',
    type: PlanLimitResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan or limit was not found.',
  })
  async remove(
    @Param('puid') puid: string,
    @Param('limitId') limitId: number
  ): Promise<PlanLimitResponseDto> {
    return this.planService.removeLimit(puid, limitId);
  }
} 