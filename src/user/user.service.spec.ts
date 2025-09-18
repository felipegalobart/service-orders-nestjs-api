import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { TestData } from '../test-utils/test-data';
import { mockUserRepository } from '../test-utils/mocks';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findByEmail', () => {
    it('should return user when found by email', async () => {
      const mockUser = TestData.createValidUser();
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should return null when user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
    });
  });

  describe('findById', () => {
    it('should return user when found by id', async () => {
      const mockUser = TestData.createValidUser();
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findById('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should return null when user not found', async () => {
      userRepository.findById.mockResolvedValue(null);

      const result = await service.findById('507f1f77bcf86cd799439012');

      expect(result).toBeNull();
      expect(userRepository.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439012',
      );
    });
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      const mockUsers = TestData.createMultipleUsers(3);
      userRepository.findAll.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(userRepository.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no users found', async () => {
      userRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(userRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return new user', async () => {
      const createUserData = TestData.createValidCreateUserData();
      const mockUser = TestData.createValidUser();
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserData);

      expect(result).toEqual(mockUser);
      expect(userRepository.create).toHaveBeenCalledWith(createUserData);
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const updateData = TestData.createValidUpdateUserData();
      const mockUser = TestData.createValidUser({ name: 'Updated Name' });
      userRepository.update.mockResolvedValue(mockUser);

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateData,
      );

      expect(result).toEqual(mockUser);
      expect(userRepository.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
      );
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      userRepository.delete.mockResolvedValue(undefined);

      await service.delete('507f1f77bcf86cd799439011');

      expect(userRepository.delete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });
  });

  describe('validatePassword', () => {
    it('should return user without password when credentials are valid', async () => {
      const mockUser = TestData.createValidUser();
      const userWithoutPassword = TestData.createUserWithoutPassword(mockUser);
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validatePassword(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual(userWithoutPassword);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.password,
      );
    });

    it('should return null when user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.validatePassword(
        'nonexistent@example.com',
        'password123',
      );

      expect(result).toBeNull();
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      const mockUser = TestData.createValidUser();
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validatePassword(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        mockUser.password,
      );
    });

    it('should return null when bcrypt comparison throws error', async () => {
      const mockUser = TestData.createValidUser();
      userRepository.findByEmail.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));

      await expect(
        service.validatePassword('test@example.com', 'password123'),
      ).rejects.toThrow('Bcrypt error');

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        'password123',
        mockUser.password,
      );
    });
  });
});
