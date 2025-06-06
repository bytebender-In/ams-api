import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { ApiResponse } from '@/common/interfaces/api-response.interface';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @SwaggerResponse({
    status: HttpStatus.CREATED,
    description: 'The subscription has been successfully created.',
    type: SubscriptionResponseDto,
  })
  async create(@Body() createSubscriptionDto: CreateSubscriptionDto): Promise<ApiResponse<SubscriptionResponseDto>> {
    const subscription = await this.subscriptionService.create(createSubscriptionDto);
    return {
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Return all subscriptions.',
    type: [SubscriptionResponseDto],
  })
  async findAll(
    @Query('userId') userId?: string,
    @Query('organizationId') organizationId?: string,
  ): Promise<ApiResponse<SubscriptionResponseDto[]>> {
    let subscriptions;
    if (userId) {
      subscriptions = await this.subscriptionService.findByUser(userId);
    } else if (organizationId) {
      subscriptions = await this.subscriptionService.findByOrganization(organizationId);
    } else {
      subscriptions = await this.subscriptionService.findAll();
    }

    return {
      success: true,
      message: 'Subscriptions retrieved successfully',
      data: subscriptions,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a subscription by id' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Return the subscription.',
    type: SubscriptionResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<ApiResponse<SubscriptionResponseDto>> {
    const subscription = await this.subscriptionService.findOne(+id);
    return {
      success: true,
      message: 'Subscription retrieved successfully',
      data: subscription,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'The subscription has been successfully updated.',
    type: SubscriptionResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: Partial<CreateSubscriptionDto>,
  ): Promise<ApiResponse<SubscriptionResponseDto>> {
    const subscription = await this.subscriptionService.update(+id, updateSubscriptionDto);
    return {
      success: true,
      message: 'Subscription updated successfully',
      data: subscription,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'The subscription has been successfully deleted.',
    type: SubscriptionResponseDto,
  })
  async remove(@Param('id') id: string): Promise<ApiResponse<SubscriptionResponseDto>> {
    const subscription = await this.subscriptionService.remove(+id);
    return {
      success: true,
      message: 'Subscription deleted successfully',
      data: subscription,
    };
  }

  @Get(':id/modules')
  @ApiOperation({ summary: 'Get available modules in subscription' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Return all available modules and their limits.',
  })
  async getAvailableModules(@Param('id') id: string): Promise<ApiResponse<any>> {
    const modules = await this.subscriptionService.getAvailableModules(+id);
    return {
      success: true,
      message: 'Available modules retrieved successfully',
      data: modules,
    };
  }

  @Get(':id/modules/:moduleId')
  @ApiOperation({ summary: 'Check access to specific module' })
  @SwaggerResponse({
    status: HttpStatus.OK,
    description: 'Return module access status and limits.',
  })
  async checkModuleAccess(
    @Param('id') id: string,
    @Param('moduleId') moduleId: string,
  ): Promise<ApiResponse<any>> {
    const access = await this.subscriptionService.checkModuleAccess(+id, moduleId);
    return {
      success: true,
      message: 'Module access checked successfully',
      data: access,
    };
  }
} 