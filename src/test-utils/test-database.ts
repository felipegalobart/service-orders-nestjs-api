import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { appConfig } from '../config/app.config';

let mongod: MongoMemoryServer;

export class TestDatabase {
  static async setup(): Promise<MongoMemoryServer> {
    mongod = await MongoMemoryServer.create();
    return mongod;
  }

  static async teardown(): Promise<void> {
    if (mongod) {
      await mongod.stop();
    }
  }

  static getUri(): string {
    return mongod?.getUri() || '';
  }
}

export const createTestModule = async (
  modules: any[],
  providers: any[] = [],
): Promise<TestingModule> => {
  const mongod = await TestDatabase.setup();

  return Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        load: [appConfig],
        envFilePath: '.env.test',
      }),
      ThrottlerModule.forRoot([
        {
          ttl: 1000, // 1 segundo para testes
          limit: 100, // Limite alto para testes
        },
      ]),
      JwtModule.register({
        global: true,
        secret: 'test-secret',
        signOptions: { expiresIn: '1h' },
      }),
      MongooseModule.forRootAsync({
        useFactory: () => ({
          uri: mongod.getUri(),
        }),
      }),
      ...modules,
    ],
    providers,
  }).compile();
};

export const createTestApp = async (
  module: TestingModule,
): Promise<INestApplication> => {
  const app = module.createNestApplication();

  // Configurar CORS para testes
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.init();
  return app;
};
