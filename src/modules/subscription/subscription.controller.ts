import { Controller, Get, Post, Body, Param, HttpStatus, HttpCode, Req, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto, SubscriptionResponseDto } from './dto/subscription.dto';
import { Auth } from '../user-management/auth/decorators/auth.decorator';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    uuid: string;
    [key: string]: any;
  };
}

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new subscription',
    description: 'Creates a new subscription for a user to a plan'
  })
  @ApiBody({ 
    type: CreateSubscriptionDto,
    description: 'The data for creating a new subscription'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The subscription has been successfully created.',
    type: SubscriptionResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided data is invalid.'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The plan was not found.'
  })
  async create(
    @Req() req: RequestWithUser,
    @Body() createSubscriptionDto: CreateSubscriptionDto
  ): Promise<SubscriptionResponseDto> {
    if (!req.user?.uuid) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.subscriptionService.create(
      req.user.uuid,
      createSubscriptionDto.plan_id
    );
  }

  @Get(':suid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get subscription by ID',
    description: 'Retrieves a specific subscription by its ID'
  })
  @ApiParam({
    name: 'suid',
    description: 'The unique identifier of the subscription',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the subscription.',
    type: SubscriptionResponseDto
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The subscription was not found.'
  })
  async findOne(@Param('suid') suid: string): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.findOne(suid);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get all subscriptions for a user',
    description: 'Retrieves all subscriptions for a specific user'
  })
  @ApiParam({
    name: 'userId',
    description: 'The unique identifier of the user',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all subscriptions for the user.',
    type: [SubscriptionResponseDto]
  })
  async findByUser(@Param('userId') userId: string): Promise<SubscriptionResponseDto[]> {
    return this.subscriptionService.findByUser(userId);
  }

  @Post(':suid/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Cancel subscription',
    description: 'Cancels an active subscription'
  })
  @ApiParam({
    name: 'suid',
    description: 'The unique identifier of the subscription',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The subscription has been successfully cancelled.',
    type: SubscriptionResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The subscription is not active.'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The subscription was not found.'
  })
  async cancel(@Param('suid') suid: string): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.cancel(suid);
  }

  @Post(':suid/renew')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Renew subscription',
    description: 'Renews an expired or cancelled subscription'
  })
  @ApiParam({
    name: 'suid',
    description: 'The unique identifier of the subscription',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The subscription has been successfully renewed.',
    type: SubscriptionResponseDto
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The subscription is already active.'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The subscription was not found.'
  })
  async renew(@Param('suid') suid: string): Promise<SubscriptionResponseDto> {
    return this.subscriptionService.renew(suid);
  }

  @Get(':suid/limits')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get subscription limits',
    description: 'Retrieves all limits for a specific subscription'
  })
  @ApiParam({
    name: 'suid',
    description: 'The unique identifier of the subscription',
    type: String
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all limits for the subscription.'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The subscription was not found.'
  })
  async getLimits(@Param('suid') suid: string) {
    return this.subscriptionService.getLimits(suid);
  }
} 