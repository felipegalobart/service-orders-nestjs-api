import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TestData } from '../test-utils/test-data';
import { mockJwtService } from '../test-utils/mocks';

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUserService = {
      validatePassword: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const mockUserWithoutPassword = TestData.createUserWithoutPassword(
        TestData.createValidUser(),
      );
      userService.validatePassword.mockResolvedValue(mockUserWithoutPassword);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual(mockUserWithoutPassword);
      expect(userService.validatePassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
    });

    it('should return null when credentials are invalid', async () => {
      userService.validatePassword.mockResolvedValue(null);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
      expect(userService.validatePassword).toHaveBeenCalledWith(
        'test@example.com',
        'wrongpassword',
      );
    });
  });

  describe('login', () => {
    it('should return access token and user data on successful login', async () => {
      const mockUserWithoutPassword = TestData.createUserWithoutPassword(
        TestData.createValidUser(),
      );
      const mockToken = 'mock-jwt-token';

      userService.validatePassword.mockResolvedValue(mockUserWithoutPassword);
      jwtService.sign.mockReturnValue(mockToken);

      const loginData = TestData.createValidLoginData();
      const result = await service.login(loginData);

      expect(result).toEqual({
        access_token: mockToken,
        user: mockUserWithoutPassword,
      });
      expect(userService.validatePassword).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUserWithoutPassword.email,
        sub: mockUserWithoutPassword.id,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      userService.validatePassword.mockResolvedValue(null);

      const loginData = TestData.createValidLoginData();

      await expect(service.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.validatePassword).toHaveBeenCalledWith(
        loginData.email,
        loginData.password,
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with correct message', async () => {
      userService.validatePassword.mockResolvedValue(null);

      const loginData = TestData.createValidLoginData();

      await expect(service.login(loginData)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('register', () => {
    it('should create new user and return access token', async () => {
      const createUserData = TestData.createValidCreateUserData();
      const mockUser = TestData.createValidUser({
        email: createUserData.email,
      });
      const mockUserWithoutPassword =
        TestData.createUserWithoutPassword(mockUser);
      const mockToken = 'mock-jwt-token';

      userService.findByEmail.mockResolvedValue(null);
      userService.create.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(mockToken);

      const result = await service.register(createUserData);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
      });
      expect(userService.findByEmail).toHaveBeenCalledWith(
        createUserData.email,
      );
      expect(userService.create).toHaveBeenCalledWith(createUserData);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });

    it('should throw UnauthorizedException when user already exists', async () => {
      const createUserData = TestData.createValidCreateUserData();
      const existingUser = TestData.createValidUser();

      userService.findByEmail.mockResolvedValue(existingUser);

      await expect(service.register(createUserData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.findByEmail).toHaveBeenCalledWith(
        createUserData.email,
      );
      expect(userService.create).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with correct message when user exists', async () => {
      const createUserData = TestData.createValidCreateUserData();
      const existingUser = TestData.createValidUser();

      userService.findByEmail.mockResolvedValue(existingUser);

      await expect(service.register(createUserData)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('validateUserByPayload', () => {
    it('should return user without password when user exists', async () => {
      const mockUser = TestData.createValidUser();
      const mockUserWithoutPassword =
        TestData.createUserWithoutPassword(mockUser);
      const payload = { email: mockUser.email, sub: mockUser.id };

      userService.findById.mockResolvedValue(mockUser);

      const result = await service.validateUserByPayload(payload);

      expect(result).toEqual(mockUserWithoutPassword);
      expect(userService.findById).toHaveBeenCalledWith(payload.sub);
    });

    it('should return null when user not found', async () => {
      const payload = {
        email: 'test@example.com',
        sub: '507f1f77bcf86cd799439011',
      };

      userService.findById.mockResolvedValue(null);

      const result = await service.validateUserByPayload(payload);

      expect(result).toBeNull();
      expect(userService.findById).toHaveBeenCalledWith(payload.sub);
    });
  });
});
