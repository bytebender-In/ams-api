import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';
import { generateEntityId, IdPrefix } from '@/common/utils/uid.utils';

@Injectable()
export class SubscriptionService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create a new subscription
   */
  async create(userId: string, planId: string) {
    // Check if plan exists and is active
    const plan = await this.db.plan.findUnique({
      where: { puid: planId },
      include: {
        plan_features: true,
        plan_limits: true,
        accesses: {
          include: {
            module: true,
            module_limits: true,
            module_features: true
          }
        }
      }
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    if (!plan.is_active) {
      throw new BadRequestException('This plan is not active');
    }

    // Check if user has any active subscriptions
    const activeSubscriptions = await this.db.subscription.findMany({
      where: {
        user_id: userId,
        status: 'active',
        end_date: {
          gt: new Date() // Only check subscriptions that haven't expired
        }
      },
      include: {
        plan: true
      }
    });

    // If user has active subscriptions, cancel them (upgrade scenario)
    if (activeSubscriptions.length > 0) {
      for (const subscription of activeSubscriptions) {
        await this.db.subscription.update({
          where: { suid: subscription.suid },
          data: { 
            status: 'cancelled',
            end_date: new Date() // End the subscription immediately
          }
        });
      }
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (plan.validity_days ?? plan.duration));

    // Create subscription with limits and module access
    const subscriptionData: any = {
      suid: generateEntityId(IdPrefix.SUBSCRIPTION),
      user_id: userId,
      plan_id: planId,
      start_date: startDate,
      end_date: endDate,
      status: 'active',
      region: 'global',
      subscription_limits: {
        create: plan.plan_limits.map(limit => ({
          limit_type: limit.limit_type,
          limit_value: limit.limit_value,
          region: limit.region
        }))
      }
    };

    // Create module access from plan features
    if (plan.plan_features && plan.plan_features.length > 0) {
      const moduleAccessMap = new Map();
      
      // Group features by module
      plan.plan_features.forEach(feature => {
        if (feature.module_id) {
          if (!moduleAccessMap.has(feature.module_id)) {
            moduleAccessMap.set(feature.module_id, {
              module_id: feature.module_id,
              is_active: true,
              region: feature.region || 'global',
              module_features: {
                create: []
              }
            });
          }
          moduleAccessMap.get(feature.module_id).module_features.create.push({
            feature_key: feature.feature_type,
            feature_value: feature.value || feature.is_enabled ? 'true' : 'false'
          });
        }
      });

      // Convert map to array for create
      subscriptionData.accesses = {
        create: Array.from(moduleAccessMap.values())
      };
    }

    const subscription = await this.db.subscription.create({
      data: subscriptionData,
      include: {
        plan: true,
        subscription_limits: true,
        accesses: {
          include: {
            module: true,
            module_limits: true,
            module_features: true
          }
        }
      }
    });

    return subscription;
  }

  /**
   * Get subscription by ID
   */
  async findOne(suid: string) {
    const subscription = await this.db.subscription.findUnique({
      where: { suid },
      include: {
        plan: true,
        subscription_limits: true,
        accesses: {
          include: {
            module: true,
            module_limits: true,
            module_features: true
          }
        }
      }
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${suid} not found`);
    }

    return subscription;
  }

  /**
   * Get all subscriptions for a user
   */
  async findByUser(userId: string) {
    return this.db.subscription.findMany({
      where: { user_id: userId },
      include: {
        plan: true,
        subscription_limits: true,
        accesses: {
          include: {
            module: true,
            module_limits: true,
            module_features: true
          }
        }
      }
    });
  }

  /**
   * Check if subscription is valid
   */
  async isValid(suid: string): Promise<boolean> {
    const subscription = await this.findOne(suid);
    
    if (subscription.status !== 'active') {
      return false;
    }

    const now = new Date();
    return now >= subscription.start_date && now <= subscription.end_date;
  }

  /**
   * Cancel subscription
   */
  async cancel(suid: string) {
    const subscription = await this.findOne(suid);

    if (subscription.status !== 'active') {
      throw new BadRequestException('Subscription is not active');
    }

    return this.db.subscription.update({
      where: { suid },
      data: { status: 'cancelled' },
      include: {
        plan: true,
        subscription_limits: true,
        accesses: {
          include: {
            module: true,
            module_limits: true,
            module_features: true
          }
        }
      }
    });
  }

  /**
   * Renew subscription
   */
  async renew(suid: string) {
    const subscription = await this.findOne(suid);
    const plan = subscription.plan;

    if (subscription.status === 'active') {
      throw new BadRequestException('Subscription is already active');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (plan.validity_days ?? plan.duration));

    return this.db.subscription.update({
      where: { suid },
      data: {
        start_date: startDate,
        end_date: endDate,
        status: 'active'
      },
      include: {
        plan: true,
        subscription_limits: true,
        accesses: {
          include: {
            module: true,
            module_limits: true,
            module_features: true
          }
        }
      }
    });
  }

  /**
   * Get subscription limits
   */
  async getLimits(suid: string) {
    const subscription = await this.findOne(suid);
    return subscription.subscription_limits;
  }

  /**
   * Check if subscription has access to a feature
   */
  async hasFeatureAccess(suid: string, featureType: string): Promise<boolean> {
    const subscription = await this.findOne(suid);
    
    if (!await this.isValid(suid)) {
      return false;
    }

    const feature = await this.db.planFeature.findFirst({
      where: {
        plan_id: subscription.plan_id,
        feature_type: featureType,
        is_enabled: true
      }
    });

    return !!feature;
  }
} 