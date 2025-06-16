import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PlanService } from './plan.service';
import { CreatePlanFeatureDto, UpdatePlanFeatureDto, PlanFeatureResponseDto } from './dto/plan-feature.dto';

/**
 * Controller for managing plan features
 * @description Handles HTTP requests for plan feature operations
 */
@ApiTags('Plan Features')
@Controller('plans/:puid/features')
export class PlanFeatureController {
  constructor(private readonly planService: PlanService) {}

  /**
   * Create a new plan feature
   * @param puid - The unique identifier of the plan
   * @param createPlanFeatureDto - The data for creating a new plan feature
   * @returns The created plan feature
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new plan feature',
    description: 'Creates a new feature for a specific plan. The feature_type must be unique per plan and region.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiBody({ 
    type: CreatePlanFeatureDto,
    description: 'The data for creating a new plan feature'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The plan feature has been successfully created.',
    type: PlanFeatureResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A feature with the same type already exists for this plan and region.',
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
    @Body() createPlanFeatureDto: CreatePlanFeatureDto
  ): Promise<PlanFeatureResponseDto> {
    return this.planService.createFeature(puid, createPlanFeatureDto);
  }

  /**
   * Get all features for a plan
   * @param puid - The unique identifier of the plan
   * @returns Array of plan features
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get all plan features',
    description: 'Retrieves all features for a specific plan.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all plan features.',
    type: [PlanFeatureResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan was not found.',
  })
  async findAll(@Param('puid') puid: string): Promise<PlanFeatureResponseDto[]> {
    return this.planService.findAllFeatures(puid);
  }

  /**
   * Get a plan feature by ID
   * @param puid - The unique identifier of the plan
   * @param featureId - The unique identifier of the feature
   * @returns The plan feature
   */
  @Get(':featureId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get a plan feature by ID',
    description: 'Retrieves a specific feature for a plan by its ID.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiParam({
    name: 'featureId',
    description: 'The unique identifier of the feature',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the plan feature.',
    type: PlanFeatureResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan or feature was not found.',
  })
  async findOne(
    @Param('puid') puid: string,
    @Param('featureId') featureId: number
  ): Promise<PlanFeatureResponseDto> {
    return this.planService.findOneFeature(puid, featureId);
  }

  /**
   * Update a plan feature
   * @param puid - The unique identifier of the plan
   * @param featureId - The unique identifier of the feature
   * @param updatePlanFeatureDto - The data to update
   * @returns The updated plan feature
   */
  @Patch(':featureId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Update a plan feature',
    description: 'Updates a specific feature for a plan.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiParam({
    name: 'featureId',
    description: 'The unique identifier of the feature',
    type: Number,
  })
  @ApiBody({ 
    type: UpdatePlanFeatureDto,
    description: 'The data to update the plan feature'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The plan feature has been successfully updated.',
    type: PlanFeatureResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan or feature was not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A feature with the same type already exists for this plan and region.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided data is invalid.',
  })
  async update(
    @Param('puid') puid: string,
    @Param('featureId') featureId: number,
    @Body() updatePlanFeatureDto: UpdatePlanFeatureDto
  ): Promise<PlanFeatureResponseDto> {
    return this.planService.updateFeature(puid, featureId, updatePlanFeatureDto);
  }

  /**
   * Delete a plan feature
   * @param puid - The unique identifier of the plan
   * @param featureId - The unique identifier of the feature
   * @returns The deleted plan feature
   */
  @Delete(':featureId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Delete a plan feature',
    description: 'Deletes a specific feature from a plan.'
  })
  @ApiParam({
    name: 'puid',
    description: 'The unique identifier of the plan',
    type: String,
  })
  @ApiParam({
    name: 'featureId',
    description: 'The unique identifier of the feature',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The plan feature has been successfully deleted.',
    type: PlanFeatureResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan or feature was not found.',
  })
  async remove(
    @Param('puid') puid: string,
    @Param('featureId') featureId: number
  ): Promise<PlanFeatureResponseDto> {
    return this.planService.removeFeature(puid, featureId);
  }
} 