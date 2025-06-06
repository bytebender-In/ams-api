import { Controller, Post, Body, Get, Param, Query, Delete, Patch } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { AddUserToOrganizationDto } from './dto/add-user-to-organization.dto';
import { OrganizationResponse, OrganizationMemberResponse } from './responses/organization.response';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OrganizationSlug } from '../../common/decorators/organization-slug.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { Auth } from '../user-management/auth/decorators/auth.decorator';

@ApiTags('organizations')
@Controller('organizations')
@Auth()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, type: OrganizationResponse })
  createOrganization(
    @CurrentUser('uuid') userId: string,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationService.createOrganization(userId, createOrganizationDto);
  }

  @Post('add-user')
  @ApiOperation({ summary: 'Add a user to an organization' })
  @ApiResponse({ status: 201, type: OrganizationResponse })
  @ApiHeader({
    name: 'X-Organization-Slug',
    description: 'Organization slug',
    required: true,
    example: 'my-org'
  })
  addUserToOrganization(
    @CurrentUser('uuid') adminId: string,
    @OrganizationSlug() slug: string,
    @Body() addUserDto: AddUserToOrganizationDto,
  ) {
    return this.organizationService.addUserToOrganization(adminId, { ...addUserDto, slug });
  }

  @Get('details')
  @ApiOperation({ summary: 'Get organization details' })
  @ApiResponse({ status: 200, type: OrganizationResponse })
  @ApiHeader({
    name: 'X-Organization-Slug',
    description: 'Organization slug',
    required: true,
    example: 'my-org'
  })
  getOrganizationDetails(
    @CurrentUser('uuid') userId: string,
    @OrganizationSlug() slug: string
  ) {
    return this.organizationService.getOrganizationDetails(slug);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get organization users' })
  @ApiResponse({ status: 200, type: [OrganizationMemberResponse] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiHeader({
    name: 'X-Organization-Slug',
    description: 'Organization slug',
    required: true,
    example: 'my-org'
  })
  getOrganizationUsers(
    @CurrentUser('uuid') userId: string,
    @OrganizationSlug() slug: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.organizationService.getOrganizationUsers(slug, page, limit);
  }

  @Delete('remove-user')
  @ApiOperation({ summary: 'Remove a user from organization' })
  @ApiResponse({ status: 200, type: OrganizationResponse })
  @ApiHeader({
    name: 'X-Organization-Slug',
    description: 'Organization slug',
    required: true,
    example: 'my-org'
  })
  removeUserFromOrganization(
    @CurrentUser('uuid') adminId: string,
    @OrganizationSlug() slug: string,
    @Body() removeUserDto: AddUserToOrganizationDto
  ) {
    return this.organizationService.removeUserFromOrganization(adminId, { ...removeUserDto, slug });
  }

  @Patch('update')
  @ApiOperation({ summary: 'Update organization details' })
  @ApiResponse({ status: 200, type: OrganizationResponse })
  @ApiHeader({
    name: 'X-Organization-Slug',
    description: 'Organization slug',
    required: true,
    example: 'my-org'
  })
  updateOrganization(
    @CurrentUser('uuid') adminId: string,
    @OrganizationSlug() slug: string,
    @Body() updateDto: CreateOrganizationDto
  ) {
    return this.organizationService.updateOrganization(adminId, { ...updateDto, slug });
  }

  @Get('subscription')
  @ApiOperation({ summary: 'Get organization subscription details' })
  @ApiResponse({ status: 200, type: OrganizationResponse })
  @ApiHeader({
    name: 'X-Organization-Slug',
    description: 'Organization slug',
    required: true,
    example: 'my-org'
  })
  getOrganizationSubscription(
    @CurrentUser('uuid') userId: string,
    @OrganizationSlug() slug: string
  ) {
    return this.organizationService.getOrganizationSubscription(userId, slug);
  }
} 