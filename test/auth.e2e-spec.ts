import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  createTestModule,
  createTestApp,
  TestDatabase,
} from '../src/test-utils/test-database';
import { AppModule } from '../src/app.module';
import { TestData } from '../src/test-utils/test-data';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestModule([AppModule]);
    app = await createTestApp(moduleFixture);
  });

  afterAll(async () => {
    await app.close();
    await TestDatabase.teardown();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      const userData = TestData.createValidCreateUserData();

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user).toHaveProperty('email', userData.email);
          expect(res.body.user).toHaveProperty('name', userData.name);
          expect(res.body.user).toHaveProperty('role', userData.role);
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should register user with default USER role when not specified', () => {
      const userData = {
        email: 'defaultuser@example.com',
        password: 'password123',
        name: 'Default User',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201)
        .expect((res) => {
          expect(res.body.user.role).toBe('user');
        });
    });

    it('should fail to register with invalid email format', () => {
      const invalidUserData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUserData)
        .expect(400);
    });

    it('should fail to register with short password', () => {
      const invalidUserData = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidUserData)
        .expect(400);
    });

    it('should fail to register with missing required fields', () => {
      const incompleteUserData = {
        email: 'test@example.com',
        // missing password and name
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(incompleteUserData)
        .expect(400);
    });

    it('should fail to register duplicate user', async () => {
      const userData = TestData.createValidCreateUserData({
        email: 'duplicate@example.com',
      });

      // First registration should succeed
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);

      // Second registration should fail
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('User already exists');
        });
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Create a user for login tests
      const userData = TestData.createValidCreateUserData({
        email: 'logintest@example.com',
      });

      await request(app.getHttpServer()).post('/auth/register').send(userData);
    });

    it('should login successfully with valid credentials', () => {
      const loginData = TestData.createValidLoginData({
        email: 'logintest@example.com',
      });

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(loginData.email);
          expect(res.body.user).not.toHaveProperty('password');

          // Store token for other tests
          accessToken = res.body.access_token;
        });
    });

    it('should fail to login with invalid email', () => {
      const invalidLoginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginData)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid credentials');
        });
    });

    it('should fail to login with invalid password', () => {
      const invalidLoginData = {
        email: 'logintest@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginData)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid credentials');
        });
    });

    it('should fail to login with invalid email format', () => {
      const invalidLoginData = {
        email: 'invalid-email',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginData)
        .expect(400);
    });

    it('should fail to login with short password', () => {
      const invalidLoginData = {
        email: 'logintest@example.com',
        password: '123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidLoginData)
        .expect(400);
    });

    it('should fail to login with missing credentials', () => {
      const incompleteLoginData = {
        email: 'logintest@example.com',
        // missing password
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(incompleteLoginData)
        .expect(400);
    });
  });

  describe('Rate Limiting Tests', () => {
    it('should apply rate limiting to register endpoint', async () => {
      const userData = {
        email: 'ratetest@example.com',
        password: 'password123',
        name: 'Rate Test User',
      };

      // Make multiple requests to trigger rate limiting
      const promises = Array.from({ length: 10 }, (_, i) =>
        request(app.getHttpServer())
          .post('/auth/register')
          .send({
            ...userData,
            email: `ratetest${i}@example.com`,
          }),
      );

      const responses = await Promise.allSettled(promises);

      // Some requests should be rate limited (429)
      const rateLimitedResponses = responses.filter(
        (response) =>
          response.status === 'fulfilled' && response.value.status === 429,
      );

      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    }, 30000); // Increase timeout for rate limiting test

    it('should apply rate limiting to login endpoint', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      // Make multiple requests to trigger rate limiting
      const promises = Array.from({ length: 10 }, () =>
        request(app.getHttpServer()).post('/auth/login').send(loginData),
      );

      const responses = await Promise.allSettled(promises);

      // Some requests should be rate limited (429)
      const rateLimitedResponses = responses.filter(
        (response) =>
          response.status === 'fulfilled' && response.value.status === 429,
      );

      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    }, 30000); // Increase timeout for rate limiting test
  });
});
