import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

interface TestConnectionResponse {
  success: boolean;
  message: string;
  version?: string;
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
}

interface VersionResult {
  version: string;
}

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private readonly maxRetries = 5;
  private readonly retryDelay = 5000; // 5 seconds

  constructor() {
    super({
      log: ['info', 'warn', 'error'],
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

  /**
   * Get the database client instance
   * This should be used only when necessary, prefer using the service methods
   */
  get client(): PrismaClient {
    return this;
  }

  /**
   * Check database connection health
   * @returns Promise<boolean> - true if connection is successful, false otherwise
   */
  async checkConnection(): Promise<boolean> {
    try {
      // Try to execute a simple query
      await this.$queryRaw`SELECT 1`;
      this.logger.log('Database connection is healthy');
      return true;
    } catch (error) {
      this.logger.error(`Database health check failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Test database connection with detailed error reporting
   * @returns Promise<TestConnectionResponse>
   */
  async testConnection(): Promise<TestConnectionResponse> {
    try {
      // Try to execute a simple query
      await this.$queryRaw`SELECT 1`;
      
      // Try to get database version
      const versionResult = await this.$queryRaw<VersionResult[]>`SELECT version()`;
      
      return {
        success: true,
        message: 'Database connection successful',
        version: versionResult[0]?.version
      };
    } catch (error) {
      this.logger.error(`Database connection test failed: ${error.message}`, error.stack);
      return {
        success: false,
        message: 'Database connection failed',
        error: {
          message: error.message,
          code: error.code,
          stack: error.stack
        }
      };
    }
  }

  /**
   * Execute a transaction
   * @param fn The function to execute within the transaction
   */
  async transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(fn);
  }

  /**
   * Execute a raw query
   * @param query The raw query to execute
   * @param params The parameters for the query
   */
  async executeRaw<T = any>(query: string, params: any[] = []): Promise<T> {
    return this.$queryRawUnsafe(query, ...params);
  }

  /**
   * Disconnect from the database
   */
  async disconnect(): Promise<void> {
    await this.$disconnect();
  }
}
