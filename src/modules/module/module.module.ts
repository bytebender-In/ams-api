import { Module } from '@nestjs/common';
import { ModuleTypeController } from './module-type/module-type.controller';
import { ModuleTypeService } from './module-type/module-type.service';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { ModuleFeatureController } from './module-feature.controller';
import { ModuleFeatureService } from './module-feature.service';

@Module({
  controllers: [ModuleTypeController, ModuleController, ModuleFeatureController],
  providers: [ModuleTypeService, ModuleService, ModuleFeatureService],
  exports: [ModuleTypeService, ModuleService, ModuleFeatureService],
})
export class ModuleModule {}
