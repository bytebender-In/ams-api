import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '@/core/database/prisma.service';

@Module({
  controllers: [PlanController, SubscriptionController],
  providers: [PlanService, SubscriptionService, PrismaService],
  exports: [PlanService, SubscriptionService],
})
export class SubscriptionModule {} 