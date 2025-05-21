import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  // Abstracted, reusable domain-level query
  // async getUserByEmail(email: string) {
  //   return this.prisma.user.findUnique({
  //     where: { email },
  //   });
  // }

  // Full Prisma access if needed
  get prismaClient(): PrismaClient {
    return this.prisma;
  }
}
