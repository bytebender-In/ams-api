import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { ModuleFeatureService } from './module-feature.service';
import { ModuleFeatureController } from './module-feature.controller';
import { PrismaService } from '@/core/database/prisma.service';

@Module({
  controllers: [ModuleController, ModuleFeatureController],
  providers: [ModuleService, ModuleFeatureService, PrismaService],
  exports: [ModuleService, ModuleFeatureService],
})
export class ModuleModule {} 