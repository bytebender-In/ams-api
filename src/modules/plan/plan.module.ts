import { Module } from '@nestjs/common';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { PlanLimitController } from './plan-limit.controller';
import { PlanFeatureController } from './plan-feature.controller';

@Module({
  controllers: [PlanController, PlanLimitController, PlanFeatureController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {} 