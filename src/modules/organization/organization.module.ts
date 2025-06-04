import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { PrismaService } from '@/core/database/prisma.service';

@Module({
  imports: [
    ConfigModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService,PrismaService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
