import { Module } from '@nestjs/common';
import { AuthModule } from './modules/user-management/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './modules/user-management/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { PrismaService } from './core/database/prisma.service';
import authConfig from './common/config/auth.config';
import { ModuleModule } from './modules/module/module.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [authConfig],
    }),
    AuthModule,
    DatabaseModule,
    CommonModule,
    UserModule,
    UserManagementModule,
    ModuleModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
