import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/database/prisma.service';

@Injectable()
export class TokenBlacklistService {
  private readonly logger = new Logger(TokenBlacklistService.name);

  constructor(private prisma: PrismaService) {}

  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + (expiresIn * 1000));

      // Check if token is already blacklisted
      const existingToken = await this.prisma.blacklistedToken.findUnique({
        where: { token },
      });

      if (existingToken) {
        this.logger.debug(`Token already blacklisted: ${token}`);
        return;
      }

      // Store token in database
      await this.prisma.blacklistedToken.create({
        data: {
          token,
          expiresAt,
        },
      });

      this.logger.debug(`Token blacklisted: ${token}`);
      this.logger.debug(`Expires at: ${expiresAt.toISOString()}`);

      // Schedule cleanup of expired token
      setTimeout(async () => {
        await this.prisma.blacklistedToken.deleteMany({
          where: {
            token,
          },
        });
        this.logger.debug(`Token removed from blacklist: ${token}`);
      }, expiresIn * 1000);

    } catch (error) {
      this.logger.error('Error blacklisting token:', error);
      throw error;
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      // Find token in database
      const blacklistedToken = await this.prisma.blacklistedToken.findUnique({
        where: { token },
      });

      // Log the check
      this.logger.debug(`Checking if token is blacklisted: ${token}`);
      this.logger.debug(`Found in blacklist: ${!!blacklistedToken}`);

      if (!blacklistedToken) {
        return false;
      }

      // Check if token has expired
      if (new Date() > blacklistedToken.expiresAt) {
        await this.prisma.blacklistedToken.delete({
          where: { token },
        });
        this.logger.debug(`Expired token removed from blacklist: ${token}`);
        return false;
      }

      this.logger.debug(`Token is blacklisted, expires at: ${blacklistedToken.expiresAt.toISOString()}`);
      return true;
    } catch (error) {
      this.logger.error('Error checking token blacklist:', error);
      return false;
    }
  }

  // Cleanup expired tokens
  async cleanupExpiredTokens(): Promise<void> {
    try {
      const result = await this.prisma.blacklistedToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(), // Delete expired tokens
          },
        },
      });
      this.logger.debug(`Cleaned up ${result.count} expired tokens`);
    } catch (error) {
      this.logger.error('Error cleaning up expired tokens:', error);
    }
  }
} 