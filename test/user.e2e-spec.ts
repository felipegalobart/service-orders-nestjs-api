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
import { UserRole } from '../src/auth/enums/user-role.enum';

describe('User (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let adminToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestModule([AppModule]);
    app = await createTestApp(moduleFixture);

    // Create test users and get tokens
    await setupTestUsers();
  });

  afterAll(async () => {
    await app.close();
    await TestDatabase.teardown();
  });

  async function setupTestUsers() {
    // Create regular user
    const userData = TestData.createValidCreateUserData({
      email: 'usertest@example.com',
      role: UserRole.USER,
    });

    const userResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData);

    userToken = userResponse.body.access_token;
    userId = userResponse.body.user.id;

    // Create admin user
    const adminData = TestData.createValidCreateUserData({
      email: 'admintest@example.com',
      role: UserRole.ADMIN,
    });

    const adminResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(adminData);

    adminToken = adminResponse.body.access_token;
  }

  describe('/users/profile (GET)', () => {
    it('should return user profile without password', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('role');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer()).get('/users/profile').expect(401);
    });

    it('should return 401 with invalid token', () => {
      return request(app.getHttpServer())
        .get('/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return user by id for admin', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('role');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 403 for non-admin user', () => {
      return request(app.getHttpServer())
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 404 for non-existent user', () => {
      const nonExistentId = '507f1f77bcf86cd799439999';

      return request(app.getHttpServer())
        .get(`/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('User not found');
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer()).get(`/users/${userId}`).expect(401);
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should allow user to update own profile', () => {
      const updateData = {
        name: 'Updated User Name',
        email: 'updated@example.com',
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('name', updateData.name);
          expect(res.body).toHaveProperty('email', updateData.email);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should allow admin to update any user', () => {
      const updateData = {
        name: 'Admin Updated Name',
        email: 'adminupdated@example.com',
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('name', updateData.name);
          expect(res.body).toHaveProperty('email', updateData.email);
        });
    });

    it('should allow admin to update user role', () => {
      const updateData = {
        role: UserRole.MODERATOR,
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('role', UserRole.MODERATOR);
        });
    });

    it('should prevent non-admin from updating role', () => {
      const updateData = {
        name: 'Updated Name',
        role: UserRole.ADMIN, // This should be ignored
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('name', updateData.name);
          expect(res.body.role).not.toBe(UserRole.ADMIN);
        });
    });

    it('should return 404 when non-admin tries to update another user', () => {
      // Create another user
      const anotherUserData = TestData.createValidCreateUserData({
        email: 'anotheruser@example.com',
      });

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(anotherUserData)
        .expect(201)
        .then((res) => {
          const anotherUserId = res.body.user.id;

          return request(app.getHttpServer())
            .put(`/users/${anotherUserId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Unauthorized Update' })
            .expect(404);
        });
    });

    it('should validate email format', () => {
      const invalidUpdateData = {
        email: 'invalid-email',
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidUpdateData)
        .expect(400);
    });

    it('should validate name minimum length', () => {
      const invalidUpdateData = {
        name: 'A', // Too short
      };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidUpdateData)
        .expect(400);
    });

    it('should return 401 without authentication', () => {
      const updateData = { name: 'Unauthorized Update' };

      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(updateData)
        .expect(401);
    });
  });

  describe('/users/:id (DELETE)', () => {
    let userToDelete: string;

    beforeEach(async () => {
      // Create a user to delete
      const userData = TestData.createValidCreateUserData({
        email: 'todelete@example.com',
      });

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData);

      userToDelete = response.body.user.id;
    });

    it('should allow admin to delete user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userToDelete}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty(
            'message',
            'User deleted successfully',
          );
        });
    });

    it('should return 403 for non-admin user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userToDelete}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userToDelete}`)
        .expect(401);
    });
  });

  describe('/users (GET)', () => {
    it('should return all users for admin', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((user: any) => {
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('name');
            expect(user).toHaveProperty('role');
            expect(user).not.toHaveProperty('password');
          });
        });
    });

    it('should return 403 for non-admin user', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });
  });

  describe('Rate Limiting Tests', () => {
    it('should apply rate limiting to user endpoints', async () => {
      const promises = Array.from({ length: 15 }, () =>
        request(app.getHttpServer())
          .get('/users/profile')
          .set('Authorization', `Bearer ${userToken}`),
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
