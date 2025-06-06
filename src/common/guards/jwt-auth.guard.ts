import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../interfaces/auth-config.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const authConfig = this.configService.get<AuthConfig>('auth');
    if (!authConfig?.jwtSecret) {
      throw new UnauthorizedException('JWT configuration is missing');
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }
} 