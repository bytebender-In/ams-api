import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from '@prisma/client';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    const { module_access, ...data } = createSubscriptionDto;
    
    // Check if plan exists
    const plan = await this.prisma.plan.findUnique({
      where: { id: data.plan_id }
    });
    
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${data.plan_id} not found`);
    }

    // Create subscription with module access
    const subscription = await this.prisma.subscription.create({
      data: {
        user_id: data.user_id,
        plan_id: data.plan_id,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        status: data.status || SubscriptionStatus.active,
        module_access: {
          create: module_access.map(access => ({
            module_id: access.module_id,
            is_active: access.is_active ?? true,
            limits: {
              create: access.limits.map(limit => ({
                limit_key: limit.limit_key,
                limit_value: limit.limit_value
              }))
            }
          }))
        }
      },
      include: {
        plan: true,
        module_access: {
          include: {
            limits: true
          }
        }
      }
    });

    return subscription;
  }

  async linkOrganization(subscriptionId: number, organizationId: string): Promise<Subscription> {
    const subscription = await this.findOne(subscriptionId);
    
    // Check if user has permission to create more organizations
    const orgLimit = await this.prisma.subscriptionModuleLimit.findFirst({
      where: {
        access: {
          subscription_id: subscriptionId,
          module_id: 'organization-management'
        },
        limit_key: 'max_organizations'
      }
    });

    if (!orgLimit) {
      throw new NotFoundException('Organization management module not found in subscription');
    }

    // Count existing organizations for this subscription
    const orgCount = await this.prisma.subscription.count({
      where: {
        user_id: subscription.user_id,
        organization_id: { not: null } // Count only subscriptions with valid organization IDs
      }
    });

    if (orgCount >= orgLimit.limit_value) {
      throw new Error('Maximum number of organizations reached for this subscription');
    }

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { organization_id: organizationId },
      include: {
        plan: true,
        module_access: {
          include: {
            limits: true,
            module: true
          }
        }
      }
    });
  }

  async findAll(): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({
      include: {
        plan: true,
      },
    });
  }

  async findOne(id: number): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  async findByUser(userId: string): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({
      where: { user_id: userId },
      include: {
        plan: true,
      },
    });
  }

  async findByOrganization(organizationId: string): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({
      where: { organization_id: organizationId },
      include: {
        plan: true,
      },
    });
  }

  async update(id: number, updateSubscriptionDto: Partial<CreateSubscriptionDto>): Promise<Subscription> {
    await this.findOne(id); // Check if subscription exists

    const data: any = { ...updateSubscriptionDto };
    if (updateSubscriptionDto.start_date) {
      data.start_date = new Date(updateSubscriptionDto.start_date);
    }
    if (updateSubscriptionDto.end_date) {
      data.end_date = new Date(updateSubscriptionDto.end_date);
    }

    return this.prisma.subscription.update({
      where: { id },
      data,
      include: {
        plan: true,
      },
    });
  }

  async remove(id: number): Promise<Subscription> {
    await this.findOne(id); // Check if subscription exists

    return this.prisma.subscription.delete({
      where: { id },
      include: {
        plan: true,
      },
    });
  }

  async getAvailableModules(subscriptionId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        module_access: {
          include: {
            module: true,
            limits: true
          }
        }
      }
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${subscriptionId} not found`);
    }

    return subscription.module_access.map(access => ({
      module_id: access.module_id,
      module_name: access.module.name,
      is_active: access.is_active,
      limits: access.limits.map(limit => ({
        key: limit.limit_key,
        value: limit.limit_value
      }))
    }));
  }

  async checkModuleAccess(subscriptionId: number, moduleId: string) {
    const access = await this.prisma.moduleAccess.findFirst({
      where: {
        subscription_id: subscriptionId,
        module_id: moduleId,
        is_active: true
      },
      include: {
        limits: true
      }
    });

    if (!access) {
      return {
        hasAccess: false,
        message: 'Module not available in subscription'
      };
    }

    return {
      hasAccess: true,
      limits: access.limits.reduce((acc, limit) => ({
        ...acc,
        [limit.limit_key]: limit.limit_value
      }), {})
    };
  }
} 