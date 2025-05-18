import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { userService } from './user.service';

@Module({
  controllers:[UserController],
  providers:[userService],
})
export class UserModule {}
