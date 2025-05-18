import { Module } from '@nestjs/common';
import { AuthModule } from './modules/user-management/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { CommonModule } from './common/common.module';
import { UserModule } from './modules/user-management/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserManagementModule } from './modules/user-management/user-management.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    DatabaseModule,
    CommonModule,
    UserModule,
    UserManagementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
