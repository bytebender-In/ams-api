import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/core/database/prisma.service';

@Module({
  imports: [],              
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],   
})
export class AuthModule {}
