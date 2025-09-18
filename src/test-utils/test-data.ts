import { UserRole } from '../auth/enums/user-role.enum';
import { IUser, ICreateUser } from '../user/schemas/models/user.interface';
import { ObjectId } from 'mongodb';

export class TestData {
  static readonly validUserId = new ObjectId().toString();
  static readonly validAdminId = new ObjectId().toString();

  static createValidUser(overrides: Partial<IUser> = {}): IUser {
    return {
      id: this.validUserId,
      email: 'test@example.com',
      password: '$2b$10$rQZ8K9XmN7pL2sV3wE5fOuH8jK1mN2pL3sV4wE5fOuH8jK1mN2pL',
      name: 'Test User',
      role: UserRole.USER,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      ...overrides,
    };
  }

  static createValidAdmin(overrides: Partial<IUser> = {}): IUser {
    return {
      id: this.validAdminId,
      email: 'admin@example.com',
      password: '$2b$10$rQZ8K9XmN7pL2sV3wE5fOuH8jK1mN2pL3sV4wE5fOuH8jK1mN2pL',
      name: 'Admin User',
      role: UserRole.ADMIN,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      ...overrides,
    };
  }

  static createValidCreateUserData(
    overrides: Partial<ICreateUser> = {},
  ): ICreateUser {
    return {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      role: UserRole.USER,
      ...overrides,
    };
  }

  static createValidLoginData(
    overrides: { email?: string; password?: string } = {},
  ) {
    return {
      email: 'test@example.com',
      password: 'password123',
      ...overrides,
    };
  }

  static createValidUpdateUserData(overrides: any = {}) {
    return {
      name: 'Updated Name',
      email: 'updated@example.com',
      ...overrides,
    };
  }

  static createMultipleUsers(count: number = 3): IUser[] {
    return Array.from({ length: count }, (_, index) =>
      this.createValidUser({
        id: new ObjectId().toString(),
        email: `user${index + 1}@example.com`,
        name: `User ${index + 1}`,
      }),
    );
  }

  static createUserWithoutPassword(user: IUser): Omit<IUser, 'password'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
