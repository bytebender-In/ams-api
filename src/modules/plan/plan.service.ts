import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import { CreatePlanLimitDto, UpdatePlanLimitDto } from './dto/plan-limit.dto';
import { CreatePlanFeatureDto, UpdatePlanFeatureDto } from './dto/plan-feature.dto';
import { generateEntityId, IdPrefix } from '@/common/utils/uid.utils';

@Injectable()
export class PlanService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Create a new plan
   * @param createPlanDto - The data for creating a new plan
   * @returns The created plan
   */
  async create(createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    // Check if plan with same name exists
    const existingPlan = await this.db.plan.findUnique({
      where: { name: createPlanDto.name }
    });

    if (existingPlan) {
      throw new ConflictException(`Plan with name ${createPlanDto.name} already exists`);
    }

    // Create new plan with custom ID
    const plan = await this.db.plan.create({
      data: {
        puid: generateEntityId(IdPrefix.PLAN),
        name: createPlanDto.name,
        description: createPlanDto.description,
        price: createPlanDto.price,
        currency: createPlanDto.currency,
        duration: createPlanDto.duration_months * 30, // Convert months to days
        interval: createPlanDto.interval,
        validity_days: createPlanDto.validity_days ?? createPlanDto.duration_months * 30,
        is_active: createPlanDto.is_active ?? true
      }
    });

    return this.mapToResponseDto(plan);
  }

  /**
   * Get all active plans
   * @returns Array of plans
   */
  async findAll(): Promise<PlanResponseDto[]> {
    const plans = await this.db.plan.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });

    return Promise.all(plans.map(plan => this.mapToResponseDto(plan)));
  }

  /**
   * Get a plan by ID
   * @param puid - The unique identifier of the plan
   * @returns The plan
   */
  async findOne(puid: string): Promise<PlanResponseDto> {
    const plan = await this.db.plan.findUnique({
      where: { puid }
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${puid} not found`);
    }

    return this.mapToResponseDto(plan);
  }

  /**
   * Update a plan
   * @param puid - The unique identifier of the plan
   * @param updatePlanDto - The data to update
   * @returns The updated plan
   */
  async update(puid: string, updatePlanDto: Partial<CreatePlanDto>): Promise<PlanResponseDto> {
    // Check if plan exists
    const existingPlan = await this.db.plan.findUnique({
      where: { puid }
    });

    if (!existingPlan) {
      throw new NotFoundException(`Plan with ID ${puid} not found`);
    }

    // If updating name, check for conflicts
    if (updatePlanDto.name && updatePlanDto.name !== existingPlan.name) {
      const planWithName = await this.db.plan.findUnique({
        where: { name: updatePlanDto.name }
      });

      if (planWithName) {
        throw new ConflictException(`Plan with name ${updatePlanDto.name} already exists`);
      }
    }

    // Prepare update data
    const updateData: any = { ...updatePlanDto };
    if (updatePlanDto.duration_months) {
      updateData.duration = updatePlanDto.duration_months * 30;
      updateData.validity_days = updatePlanDto.validity_days ?? updatePlanDto.duration_months * 30;
    }

    // Update plan
    const updatedPlan = await this.db.plan.update({
      where: { puid },
      data: updateData
    });

    return this.mapToResponseDto(updatedPlan);
  }

  /**
   * Delete a plan
   * @param puid - The unique identifier of the plan
   * @returns The deleted plan
   */
  async remove(puid: string): Promise<PlanResponseDto> {
    // Check if plan exists
    const existingPlan = await this.db.plan.findUnique({
      where: { puid }
    });

    if (!existingPlan) {
      throw new NotFoundException(`Plan with ID ${puid} not found`);
    }

    // Check if plan has active subscriptions
    const activeSubscriptions = await this.db.subscription.count({
      where: {
        plan_id: puid,
        status: 'active'
      }
    });

    if (activeSubscriptions > 0) {
      throw new ConflictException('Cannot delete plan with active subscriptions');
    }

    // Delete plan
    const deletedPlan = await this.db.plan.delete({
      where: { puid }
    });

    return this.mapToResponseDto(deletedPlan);
  }

  /**
   * Map Prisma plan model to response DTO
   * @param plan - The plan from Prisma
   * @returns The plan response DTO
   */
  private async mapToResponseDto(plan: any): Promise<PlanResponseDto> {
    // Get features and limits
    const [features, limits] = await Promise.all([
      this.db.planFeature.findMany({
        where: { plan_id: plan.puid },
        include: {
          module: true
        }
      }),
      this.db.planLimit.findMany({
        where: { plan_id: plan.puid }
      })
    ]);

    // Filter out features with deleted modules
    const validFeatures = features.filter(feature => feature.module !== null);

    return {
      puid: plan.puid,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      duration_months: Math.floor(plan.duration / 30),
      interval: plan.interval,
      validity_days: plan.validity_days,
      is_active: plan.is_active,
      created_at: plan.created_at,
      updated_at: plan.updated_at,
      features: validFeatures,
      limits
    };
  }

  /**
   * Create a new plan feature
   * @param puid - The unique identifier of the plan
   * @param createPlanFeatureDto - The data for creating a new plan feature
   * @returns The created plan feature
   */
  async createFeature(puid: string, createPlanFeatureDto: CreatePlanFeatureDto) {
    const plan = await this.db.plan.findUnique({
      where: { puid },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with puid ${puid} not found`);
    }

    // If module_id is provided, verify the module exists
    if (createPlanFeatureDto.module_id) {
      const module = await this.db.module.findUnique({
        where: { mouid: createPlanFeatureDto.module_id }
      });

      if (!module) {
        throw new NotFoundException(`Module with ID ${createPlanFeatureDto.module_id} not found`);
      }

      if (!module.is_active) {
        throw new BadRequestException(`Module ${module.name} is not active`);
      }
    }

    // Check if feature type already exists for this plan and region
    const existingFeature = await this.db.planFeature.findFirst({
      where: {
        plan: { puid },
        feature_type: createPlanFeatureDto.feature_type,
        region: createPlanFeatureDto.region,
      },
    });

    if (existingFeature) {
      throw new ConflictException(
        `A feature with type ${createPlanFeatureDto.feature_type} already exists for this plan and region`,
      );
    }

    return this.db.planFeature.create({
      data: {
        feature_type: createPlanFeatureDto.feature_type,
        value: createPlanFeatureDto.value,
        is_enabled: createPlanFeatureDto.is_enabled ?? true,
        region: createPlanFeatureDto.region,
        plan: { connect: { puid } },
        module: createPlanFeatureDto.module_id ? { connect: { mouid: createPlanFeatureDto.module_id } } : undefined
      },
      include: {
        module: true
      }
    });
  }

  /**
   * Get all features for a plan
   * @param puid - The unique identifier of the plan
   * @returns Array of plan features
   */
  async findAllFeatures(puid: string) {
    const plan = await this.db.plan.findUnique({
      where: { puid },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with puid ${puid} not found`);
    }

    return this.db.planFeature.findMany({
      where: { plan: { puid } },
      include: {
        module: true
      }
    });
  }

  /**
   * Get a plan feature by ID
   * @param puid - The unique identifier of the plan
   * @param featureId - The unique identifier of the feature
   * @returns The plan feature
   */
  async findOneFeature(puid: string, featureId: number) {
    const plan = await this.db.plan.findUnique({
      where: { puid },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with puid ${puid} not found`);
    }

    const feature = await this.db.planFeature.findFirst({
      where: {
        id: featureId,
        plan: { puid },
      },
    });

    if (!feature) {
      throw new NotFoundException(
        `Feature with id ${featureId} not found for plan ${puid}`,
      );
    }

    return feature;
  }

  /**
   * Update a plan feature
   * @param puid - The unique identifier of the plan
   * @param featureId - The unique identifier of the feature
   * @param updatePlanFeatureDto - The data to update
   * @returns The updated plan feature
   */
  async updateFeature(
    puid: string,
    featureId: number,
    updatePlanFeatureDto: UpdatePlanFeatureDto,
  ) {
    const plan = await this.db.plan.findUnique({
      where: { puid },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with puid ${puid} not found`);
    }

    const feature = await this.db.planFeature.findFirst({
      where: {
        id: featureId,
        plan: { puid },
      },
    });

    if (!feature) {
      throw new NotFoundException(
        `Feature with id ${featureId} not found for plan ${puid}`,
      );
    }

    // If feature type is being updated, check for conflicts
    if (updatePlanFeatureDto.feature_type) {
      const existingFeature = await this.db.planFeature.findFirst({
        where: {
          plan: { puid },
          feature_type: updatePlanFeatureDto.feature_type,
          region: updatePlanFeatureDto.region || feature.region,
          id: { not: featureId },
        },
      });

      if (existingFeature) {
        throw new ConflictException(
          `A feature with type ${updatePlanFeatureDto.feature_type} already exists for this plan and region`,
        );
      }
    }

    return this.db.planFeature.update({
      where: { id: featureId },
      data: updatePlanFeatureDto,
    });
  }

  /**
   * Delete a plan feature
   * @param puid - The unique identifier of the plan
   * @param featureId - The unique identifier of the feature
   * @returns The deleted plan feature
   */
  async removeFeature(puid: string, featureId: number) {
    const plan = await this.db.plan.findUnique({
      where: { puid },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with puid ${puid} not found`);
    }

    const feature = await this.db.planFeature.findFirst({
      where: {
        id: featureId,
        plan: { puid },
      },
    });

    if (!feature) {
      throw new NotFoundException(
        `Feature with id ${featureId} not found for plan ${puid}`,
      );
    }

    return this.db.planFeature.delete({
      where: { id: featureId },
    });
  }

  /**
   * Create a new plan limit
   * @param puid - The unique identifier of the plan
   * @param createPlanLimitDto - The data for creating a new plan limit
   * @returns The created plan limit
   */
  async createLimit(puid: string, createPlanLimitDto: CreatePlanLimitDto) {
    const plan = await this.db.plan.findUnique({
      where: { puid },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with puid ${puid} not found`);
    }

    // Check if limit type already exists for this plan and region
    const existingLimit = await this.db.planLimit.findFirst({
      where: {
        plan: { puid },
        limit_type: createPlanLimitDto.limit_type,
        region: createPlanLimitDto.region,
      },
    });

    if (existingLimit) {
      throw new ConflictException(
        `A limit with type ${createPlanLimitDto.limit_type} already exists for this plan and region`,
      );
    }

    return this.db.planLimit.create({
      data: {
        ...createPlanLimitDto,
        plan: { connect: { puid } },
      },
    });
  }

  /**
   * Get all limits for a plan
   * @param puid - The unique identifier of the plan
   * @returns Array of plan limits
   */
  async findAllLimits(puid: string) {
    const plan = await this.db.plan.findUnique({
      where: { puid },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with puid ${puid} not found`);
    }

    return this.db.planLimit.findMany({
      where: { plan: { puid } },
    });
  }

  /**
   * Get a plan limit by ID
   * @param puid - The unique identifier of the plan
   * @param limitId - The unique identifier of the limit
   * @returns The plan limit
   */
  async findOneLimit(puid: string, limitId: number) {
    const plan = await this.db.plan.findUnique({
      where: { puid },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with puid ${puid} not found`);
    }

    const limit = await this.db.planLimit.findFirst({
      where: {
        id: limitId,
        plan: { puid },
      },
    });

    if (!limit) {
      throw new NotFoundException(
        `Limit with id ${limitId} not found for plan ${puid}`,
      );
    }

    return limit;
  }

  /**
   * Update a plan limit
   * @param puid - The unique identifier of the plan
   * @param limitId - The unique identifier of the limit
   * @param updatePlanLimitDto - The data to update
   * @returns The updated plan limit
   */
  async updateLimit(
    puid: string,
    limitId: number,
    updatePlanLimitDto: UpdatePlanLimitDto,
  ) {
    const plan = await this.db.plan.findUnique({
      where: { puid },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with puid ${puid} not found`);
    }

    const limit = await this.db.planLimit.findFirst({
      where: {
        id: limitId,
        plan: { puid },
      },
    });

    if (!limit) {
      throw new NotFoundException(
        `Limit with id ${limitId} not found for plan ${puid}`,
      );
    }

    // If limit type is being updated, check for conflicts
    if (updatePlanLimitDto.limit_type) {
      const existingLimit = await this.db.planLimit.findFirst({
        where: {
          plan: { puid },
          limit_type: updatePlanLimitDto.limit_type,
          region: updatePlanLimitDto.region || limit.region,
          id: { not: limitId },
        },
      });

      if (existingLimit) {
        throw new ConflictException(
          `A limit with type ${updatePlanLimitDto.limit_type} already exists for this plan and region`,
        );
      }
    }

    return this.db.planLimit.update({
      where: { id: limitId },
      data: updatePlanLimitDto,
    });
  }

  /**
   * Delete a plan limit
   * @param puid - The unique identifier of the plan
   * @param limitId - The unique identifier of the limit
   * @returns The deleted plan limit
   */
  async removeLimit(puid: string, limitId: number) {
    const plan = await this.db.plan.findUnique({
      where: { puid },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with puid ${puid} not found`);
    }

    const limit = await this.db.planLimit.findFirst({
      where: {
        id: limitId,
        plan: { puid },
      },
    });

    if (!limit) {
      throw new NotFoundException(
        `Limit with id ${limitId} not found for plan ${puid}`,
      );
    }

    return this.db.planLimit.delete({
      where: { id: limitId },
    });
  }
} 