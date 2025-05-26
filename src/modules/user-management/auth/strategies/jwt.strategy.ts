import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenBlacklistService } from '../services/token-blacklist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private tokenBlacklistService: TokenBlacklistService,
  ) {
    const secret = configService.get<string>('auth.jwtSecret');
    if (!secret) {
      throw new Error('JWT secret is not defined in configuration');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });

    this.logger.debug(`JWT Strategy initialized with secret: ${secret}`);
  }

  async validate(request: any, payload: { sub: string }) {
    try {
      // Get the token from the request
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      if (!token) {
        this.logger.error('No token found in request');
        throw new UnauthorizedException('Authentication token is required');
      }

      // Log the token for debugging (only first 10 chars for security)
      const tokenPreview = token.substring(0, 10) + '...';
      this.logger.debug(`Validating token: ${tokenPreview}`);
      
      // Check if token is blacklisted BEFORE validating the payload
      const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token);
      this.logger.debug(`Token blacklist check result: ${isBlacklisted}`);
      
      if (isBlacklisted) {
        this.logger.warn(`Attempted to use blacklisted token: ${tokenPreview}`);
        throw new UnauthorizedException('This token has been invalidated. Please log in again.');
      }

      // Only validate payload if token is not blacklisted
      if (!payload.sub) {
        this.logger.error('Invalid token payload: missing sub claim');
        throw new UnauthorizedException('Invalid authentication token: missing user information');
      }
      
      this.logger.debug(`Token validation successful for user: ${payload.sub}`);
      return { uuid: payload.sub };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Token validation error: ${error.message}`);
      throw new UnauthorizedException('Invalid authentication token. Please log in again.');
    }
  }
}
