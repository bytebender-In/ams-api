import { registerAs } from '@nestjs/config';
import { AuthConfig } from './interfaces/auth-config.interface';

const validateAuthConfig = (config: AuthConfig): void => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (!isDevelopment) {
    if (!config.jwtSecret || config.jwtSecret === 'test-ams') {
      throw new Error('JWT_SECRET must be set in environment variables');
    }
    if (!config.refreshTokenSecret || config.refreshTokenSecret === 'test-ams') {
      throw new Error('REFRESH_TOKEN_SECRET must be set in environment variables');
    }
  }
};

export default registerAs('auth', (): AuthConfig => {
  const config: AuthConfig = {
    jwtSecret: process.env.JWT_SECRET || 'test-ams',
    jwtExpiration: process.env.JWT_EXPIRATION || '15m',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'test-ams-refresh',
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  };

  validateAuthConfig(config);
  return config;
});
