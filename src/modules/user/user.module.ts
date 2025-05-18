import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UserController } from './user.controller';
import { userService } from './user.service';

@Module({
  controllers:[UserController],
  providers:[userService],
  imports: [RoleModule, PermissionsModule]
})
export class UserModule {}
