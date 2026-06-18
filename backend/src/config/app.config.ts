import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT || '5011', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
}));
