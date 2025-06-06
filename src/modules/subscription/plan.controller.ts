import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { PlanResponseDto } from './dto/plan-response.dto';
import { ApiResponse } from '@/common/interfaces/api-response.interface';

@ApiTags('plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new plan' })
  @SwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'The plan has been successfully created.',
    type: PlanResponseDto,
  })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<ApiResponse<PlanResponseDto>> {
    const plan = await this.planService.create(createPlanDto);
    return {
      success: true,
      message: 'Plan created successfully',
      data: plan,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all plans' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Return all active plans.',
    type: [PlanResponseDto],
  })
  async findAll(): Promise<ApiResponse<PlanResponseDto[]>> {
    const plans = await this.planService.findAll();
    return {
      success: true,
      message: 'Plans retrieved successfully',
      data: plans,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a plan by id' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Return the plan.',
    type: PlanResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ApiResponse<PlanResponseDto>> {
    const plan = await this.planService.findOne(+id);
    return {
      success: true,
      message: 'Plan retrieved successfully',
      data: plan,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a plan' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'The plan has been successfully updated.',
    type: PlanResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: Partial<CreatePlanDto>,
  ): Promise<ApiResponse<PlanResponseDto>> {
    const plan = await this.planService.update(+id, updatePlanDto);
    return {
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a plan' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'The plan has been successfully deleted.',
    type: PlanResponseDto,
  })
  async remove(@Param('id') id: string): Promise<ApiResponse<PlanResponseDto>> {
    const plan = await this.planService.remove(+id);
    return {
      success: true,
      message: 'Plan deleted successfully',
      data: plan,
    };
  }
} 