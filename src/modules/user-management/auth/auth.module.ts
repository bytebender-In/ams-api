import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '@/core/database/prisma.service';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { MailModule } from '@/modules/mail/mail.module';
import { DatabaseService } from '@/core/database/database.service';
import { DatabaseModule } from '@/core/database/database.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('auth.jwtSecret'),
        signOptions: {
          expiresIn: configService.get('auth.jwtExpiration'),
        },
      }),
      inject: [ConfigService],
    }),
    MailModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    TokenBlacklistService,
    DatabaseService
  ],
  exports: [AuthService],
})
export class AuthModule {}
