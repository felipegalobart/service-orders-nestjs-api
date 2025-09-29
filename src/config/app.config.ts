export interface IAppConfig {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  apiPrefix: string;
  corsOrigin: string;
  logLevel: string;
  throttlerTtl: number;
  throttlerLimit: number;

  // Redis Configuration
  redisHost: string;
  redisPort: number;
  redisPassword: string;
}

export const appConfig = (): IAppConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri:
    process.env.MONGODB_URI || 'mongodb://localhost:27017/service-orders',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  logLevel: process.env.LOG_LEVEL || 'debug',
  throttlerTtl: parseInt(process.env.THROTTLE_TTL || '60000', 10), // 1 minuto em ms
  throttlerLimit: parseInt(process.env.THROTTLE_LIMIT || '10', 10), // 10 requests por minuto

  // Redis Configuration
  redisHost: process.env.REDIS_HOST || '192.168.31.75',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  redisPassword: process.env.REDIS_PASSWORD || '',
});
