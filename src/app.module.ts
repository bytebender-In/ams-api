import { Module } from '@nestjs/common';
import { AuthModule } from './modules/user-management/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './modules/user-management/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserManagementModule } from './modules/user-management/user-management.module';
import authConfig from './common/config/auth.config';
import { DocumentationModule } from './modules/documentation/documentation.module';
import { ModuleModule } from './modules/module/module.module';
import { PlanModule } from './modules/plan/plan.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
    }),
    DatabaseModule,
    CommonModule,
    AuthModule,
    UserModule,
    UserManagementModule,
    ModuleModule,
    DocumentationModule,
    PlanModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
