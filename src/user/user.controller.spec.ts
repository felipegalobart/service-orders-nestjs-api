import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TestData } from '../test-utils/test-data';
import { UserRole } from '../auth/enums/user-role.enum';
import { IUser } from './schemas/models/user.interface';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockUserService = {
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      validatePassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return current user profile without password', () => {
      const mockUser = TestData.createUserWithoutPassword(
        TestData.createValidUser(),
      );

      const result = controller.getProfile(mockUser);

      expect(result).toEqual(mockUser);
    });

    it('should return user data with all fields except password', () => {
      const mockUser = TestData.createUserWithoutPassword(
        TestData.createValidUser({
          name: 'John Doe',
          email: 'john@example.com',
          role: UserRole.USER,
        }),
      );

      const result = controller.getProfile(mockUser);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('role');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('getUserById', () => {
    it('should return user without password when user exists', async () => {
      const mockUser = TestData.createValidUser();
      const mockUserWithoutPassword =
        TestData.createUserWithoutPassword(mockUser);
      userService.findById.mockResolvedValue(mockUser);

      const result = await controller.getUserById('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockUserWithoutPassword);
      expect(userService.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      userService.findById.mockResolvedValue(null);

      await expect(
        controller.getUserById('507f1f77bcf86cd799439012'),
      ).rejects.toThrow(NotFoundException);
      expect(userService.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439012',
      );
    });

    it('should throw NotFoundException with correct message', async () => {
      userService.findById.mockResolvedValue(null);

      await expect(
        controller.getUserById('507f1f77bcf86cd799439012'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user when user updates own profile', async () => {
      const currentUser = TestData.createUserWithoutPassword(
        TestData.createValidUser(),
      );
      const updateData = TestData.createValidUpdateUserData();
      const updatedUser = TestData.createValidUser({
        id: currentUser.id,
        name: updateData.name,
        email: updateData.email,
      });
      const updatedUserWithoutPassword =
        TestData.createUserWithoutPassword(updatedUser);

      userService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(
        currentUser.id,
        updateData,
        currentUser,
      );

      expect(result).toEqual(updatedUserWithoutPassword);
      expect(userService.update).toHaveBeenCalledWith(
        currentUser.id,
        updateData,
      );
    });

    it('should update user when admin updates any user', async () => {
      const adminUser = TestData.createUserWithoutPassword(
        TestData.createValidAdmin(),
      );
      const targetUserId = '507f1f77bcf86cd799439012';
      const updateData = TestData.createValidUpdateUserData();
      const updatedUser = TestData.createValidUser({
        id: targetUserId,
        name: updateData.name,
        email: updateData.email,
      });
      const updatedUserWithoutPassword =
        TestData.createUserWithoutPassword(updatedUser);

      userService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(
        targetUserId,
        updateData,
        adminUser,
      );

      expect(result).toEqual(updatedUserWithoutPassword);
      expect(userService.update).toHaveBeenCalledWith(targetUserId, updateData);
    });

    it('should allow admin to update user role', async () => {
      const adminUser = TestData.createUserWithoutPassword(
        TestData.createValidAdmin(),
      );
      const targetUserId = '507f1f77bcf86cd799439012';
      const updateData = {
        ...TestData.createValidUpdateUserData(),
        role: UserRole.MODERATOR,
      };
      const updatedUser = TestData.createValidUser({
        id: targetUserId,
        role: UserRole.MODERATOR,
      });
      const updatedUserWithoutPassword =
        TestData.createUserWithoutPassword(updatedUser);

      userService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(
        targetUserId,
        updateData,
        adminUser,
      );

      expect(result).toEqual(updatedUserWithoutPassword);
      expect(userService.update).toHaveBeenCalledWith(targetUserId, updateData);
    });

    it('should prevent non-admin from updating role', async () => {
      const currentUser = TestData.createUserWithoutPassword(
        TestData.createValidUser(),
      );
      const updateData = {
        ...TestData.createValidUpdateUserData(),
        role: UserRole.ADMIN, // Tentativa de escalação de privilégio
      };
      const updatedUser = TestData.createValidUser({
        id: currentUser.id,
        name: updateData.name,
        email: updateData.email,
        role: currentUser.role, // Role não deve mudar
      });
      const updatedUserWithoutPassword =
        TestData.createUserWithoutPassword(updatedUser);

      userService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(
        currentUser.id,
        updateData,
        currentUser,
      );

      expect(result).toEqual(updatedUserWithoutPassword);
      expect(userService.update).toHaveBeenCalledWith(currentUser.id, {
        name: updateData.name,
        email: updateData.email,
        // role deve ser removido para não-admins
      });
    });

    it('should throw NotFoundException when non-admin tries to update another user', async () => {
      const currentUser = TestData.createUserWithoutPassword(
        TestData.createValidUser(),
      );
      const targetUserId = '507f1f77bcf86cd799439012';
      const updateData = TestData.createValidUpdateUserData();

      await expect(
        controller.updateUser(targetUserId, updateData, currentUser),
      ).rejects.toThrow(NotFoundException);

      expect(userService.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException with correct message for unauthorized update', async () => {
      const currentUser = TestData.createUserWithoutPassword(
        TestData.createValidUser(),
      );
      const targetUserId = '507f1f77bcf86cd799439012';
      const updateData = TestData.createValidUpdateUserData();

      await expect(
        controller.updateUser(targetUserId, updateData, currentUser),
      ).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      userService.delete.mockResolvedValue(undefined);

      const result = await controller.deleteUser('507f1f77bcf86cd799439011');

      expect(result).toEqual({ message: 'User deleted successfully' });
      expect(userService.delete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should handle deletion errors gracefully', async () => {
      userService.delete.mockRejectedValue(new Error('Database error'));

      await expect(
        controller.deleteUser('507f1f77bcf86cd799439011'),
      ).rejects.toThrow('Database error');
      expect(userService.delete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return array of users without passwords', async () => {
      const mockUsers = TestData.createMultipleUsers(3);
      const mockUsersWithoutPasswords = mockUsers.map((user) =>
        TestData.createUserWithoutPassword(user),
      );

      userService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.getAllUsers();

      expect(result).toEqual(mockUsersWithoutPasswords);
      expect(userService.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users found', async () => {
      userService.findAll.mockResolvedValue([]);

      const result = await controller.getAllUsers();

      expect(result).toEqual([]);
      expect(userService.findAll).toHaveBeenCalled();
    });

    it('should exclude password field from all returned users', async () => {
      const mockUsers = TestData.createMultipleUsers(2);
      userService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.getAllUsers();

      result.forEach((user) => {
        expect(user).not.toHaveProperty('password');
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('role');
      });
    });
  });
});
