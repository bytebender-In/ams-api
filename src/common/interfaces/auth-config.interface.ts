export interface AuthConfig {
  jwtSecret: string;
  jwtExpiration: string;
  refreshTokenSecret: string;
  refreshTokenExpiration: string;
  saltRounds: number;
} 