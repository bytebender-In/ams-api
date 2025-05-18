import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [RoleModule, PermissionsModule]
})
export class UsersModule {}
