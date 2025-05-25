import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly maxRetries = 5;
  private readonly retryDelay = 5000; // 5 seconds

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    this.logger.log('Connecting to the database...');
    let retries = 0;
    
    while (retries < this.maxRetries) {
      try {
        await this.$connect();
        this.logger.log('Database connection established.');
        return;
      } catch (error) {
        retries++;
        this.logger.error(
          `Failed to connect to the database (attempt ${retries}/${this.maxRetries}): ${error.message}`,
        );
        
        if (retries === this.maxRetries) {
          this.logger.error('Max retries reached. Could not connect to the database.');
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from the database...');
    try {
      await this.$disconnect();
      this.logger.log('Database connection closed.');
    } catch (error) {
      this.logger.error(`Error while disconnecting from the database: ${error.message}`);
    }
  }

  // Add a method to check database connection health
  async checkConnection() {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error(`Database health check failed: ${error.message}`);
      return false;
    }
  }

  // Optional: Add global Prisma middlewares, logging, soft delete handlers, etc.
}
