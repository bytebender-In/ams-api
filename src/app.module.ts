import { Module } from '@nestjs/common';
import { DatabaseModule } from './core/database/database.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from './common/config/auth.config';
import { ModuleModule } from './modules/module/module.module';
import { PlanModule } from './modules/plan/plan.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { UserManagementModule } from './modules/user-management/user-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
    }),
    DatabaseModule,
    CommonModule,
    UserManagementModule,
    ModuleModule,
    PlanModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
