import { Injectable } from '@nestjs/common';
import { CreateModuleFeatureDto } from './dto/create-module-feature.dto';
import { ModuleFeature } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma.service';

@Injectable()
export class ModuleFeatureService {
  constructor(private prisma: PrismaService) {}

  async create(createModuleFeatureDto: CreateModuleFeatureDto): Promise<ModuleFeature> {
    return this.prisma.moduleFeature.create({
      data: createModuleFeatureDto,
    });
  }

  async findAll(): Promise<ModuleFeature[]> {
    return this.prisma.moduleFeature.findMany({
      include: {
        module: true,
      },
    });
  }

  async findByModuleId(moduleId: string): Promise<ModuleFeature[]> {
    return this.prisma.moduleFeature.findMany({
      where: { module_id: moduleId },
      include: {
        module: true,
      },
    });
  }

  async update(mfuid: string, updateModuleFeatureDto: Partial<CreateModuleFeatureDto>): Promise<ModuleFeature> {
    return this.prisma.moduleFeature.update({
      where: { mfuid },
      data: updateModuleFeatureDto,
    });
  }

  async remove(mfuid: string): Promise<ModuleFeature> {
    return this.prisma.moduleFeature.delete({
      where: { mfuid },
    });
  }
} 