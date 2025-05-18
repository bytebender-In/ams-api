import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/role.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [AuthModule, UserModule, RolesModule, PermissionsModule],
  exports: [AuthModule, UserModule, RolesModule, PermissionsModule],
})
export class UserManagementModule {}
