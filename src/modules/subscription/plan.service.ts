import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Plan } from '@prisma/client';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const { module_access, ...planData } = createPlanDto;
    return this.prisma.plan.create({
      data: {
        ...planData,
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
        module_access: {
          include: {
            limits: true
          }
        }
      }
    });
  }

  async findAll(): Promise<Plan[]> {
    return this.prisma.plan.findMany({
      where: {
        is_active: true,
      },
      include: {
        module_access: {
          include: {
            limits: true
          }
        }
      }
    });
  }

  async findOne(id: number): Promise<Plan> {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: {
        module_access: {
          include: {
            limits: true
          }
        }
      }
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return plan;
  }

  async update(id: number, updatePlanDto: Partial<CreatePlanDto>): Promise<Plan> {
    await this.findOne(id); // Check if plan exists

    const { module_access, ...planData } = updatePlanDto;
    return this.prisma.plan.update({
      where: { id },
      data: {
        ...planData,
        module_access: module_access ? {
          deleteMany: {},
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
        } : undefined
      },
      include: {
        module_access: {
          include: {
            limits: true
          }
        }
      }
    });
  }

  async remove(id: number): Promise<Plan> {
    await this.findOne(id); // Check if plan exists
    return this.prisma.plan.delete({
      where: { id },
      include: {
        module_access: {
          include: {
            limits: true
          }
        }
      }
    });
  }
} 