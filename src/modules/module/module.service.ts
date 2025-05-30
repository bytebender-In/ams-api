import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { Module } from '@prisma/client';
import { PrismaService } from '@/core/database/prisma.service';

@Injectable()
export class ModuleService {
  constructor(private prisma: PrismaService) {}

  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    return this.prisma.module.create({
      data: createModuleDto,
    });
  }

  async findAll(): Promise<Module[]> {
    return this.prisma.module.findMany({
      include: {
        features: true,
        children: true,
      },
    });
  }

  async findOne(muid: string): Promise<Module> {
    const module = await this.prisma.module.findUnique({
      where: { muid },
      include: {
        features: true,
        children: true,
      },
    });
    
    if (!module) {
      throw new NotFoundException(`Module with muid ${muid} not found`);
    }
    
    return module;
  }

  async update(muid: string, updateModuleDto: Partial<CreateModuleDto>): Promise<Module> {
    return this.prisma.module.update({
      where: { muid },
      data: updateModuleDto,
    });
  }

  async remove(muid: string): Promise<Module> {
    return this.prisma.module.delete({
      where: { muid },
    });
  }
} 