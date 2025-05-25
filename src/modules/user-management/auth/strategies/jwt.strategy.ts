import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('auth.jwtSecret');
    if (!secret) {
      throw new Error('JWT secret is not defined in configuration');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    this.logger.debug(`JWT Strategy initialized with secret: ${secret}`);
  }

  async validate(payload: { sub: string }) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
    this.logger.debug(`JWT Secret used for validation: ${this.configService.get('auth.jwtSecret')}`);
    
    if (!payload.sub) {
      this.logger.error('Invalid token payload: missing sub claim');
      throw new UnauthorizedException('Invalid token payload');
    }
    
    this.logger.debug(`Token validation successful for user: ${payload.sub}`);
    return { uuid: payload.sub };
  }
}
