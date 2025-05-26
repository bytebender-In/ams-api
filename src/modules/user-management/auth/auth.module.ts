import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '@/core/database/prisma.service';
import { TokenBlacklistService } from './services/token-blacklist.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('auth.jwtSecret');
        const expiresIn = configService.get<string>('auth.jwtExpiration');
        
        const logger = new Logger('JwtModule');
        logger.debug(`JWT Module Configuration:`);
        logger.debug(`- Secret: ${secret}`);
        logger.debug(`- Expires In: ${expiresIn}`);
        
        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService, TokenBlacklistService],
  exports: [AuthService],
})
export class AuthModule {}
