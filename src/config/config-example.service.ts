import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigExampleService {
  constructor(private configService: ConfigService) {}

  getDatabaseUri(): string {
    return (
      this.configService.get<string>('mongodbUri') ||
      'mongodb://localhost:27017/service-orders'
    );
  }

  getJwtSecret(): string {
    return (
      this.configService.get<string>('jwtSecret') ||
      'your-super-secret-jwt-key-here'
    );
  }

  getApiPrefix(): string {
    return this.configService.get<string>('apiPrefix') || 'api/v1';
  }

  isDevelopment(): boolean {
    return this.configService.get<string>('nodeEnv') === 'development';
  }
}
