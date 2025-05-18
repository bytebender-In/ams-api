import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  databaseURL: process.env.DATABASE_URL,
}));
