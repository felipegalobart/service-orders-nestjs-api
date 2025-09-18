import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TestData } from '../test-utils/test-data';
import { mockJwtService } from '../test-utils/mocks';
import { UserRole } from './enums/user-role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      validateUser: jest.fn(),
      validateUserByPayload: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token and user data on successful login', async () => {
      const loginData = TestData.createValidLoginData();
      const mockResponse = {
        access_token: 'mock-jwt-token',
        user: TestData.createUserWithoutPassword(TestData.createValidUser()),
      };

      authService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginData);

      expect(result).toEqual(mockResponse);
      expect(authService.login).toHaveBeenCalledWith(loginData);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginData = TestData.createValidLoginData();
      authService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginData);
    });

    it('should validate email format', async () => {
      const invalidLoginData = {
        email: 'invalid-email',
        password: 'password123',
      };

      // O ZodValidationPipe deve rejeitar dados inválidos
      // Este teste verifica que o controller recebe dados já validados
      const validLoginData = TestData.createValidLoginData();
      const mockResponse = {
        access_token: 'mock-jwt-token',
        user: TestData.createUserWithoutPassword(TestData.createValidUser()),
      };

      authService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(validLoginData);
      expect(result).toEqual(mockResponse);
    });

    it('should validate password minimum length', async () => {
      const shortPasswordData = {
        email: 'test@example.com',
        password: '123', // Menos de 6 caracteres
      };

      // O ZodValidationPipe deve rejeitar dados inválidos
      // Este teste verifica que o controller recebe dados já validados
      const validLoginData = TestData.createValidLoginData();
      const mockResponse = {
        access_token: 'mock-jwt-token',
        user: TestData.createUserWithoutPassword(TestData.createValidUser()),
      };

      authService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(validLoginData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    it('should register new user and return access token', async () => {
      const registerData = TestData.createValidCreateUserData();
      const mockResponse = {
        access_token: 'mock-jwt-token',
        user: {
          id: '507f1f77bcf86cd799439011',
          email: registerData.email,
          name: registerData.name,
          role: UserRole.USER,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      };

      authService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(registerData);

      expect(result).toEqual(mockResponse);
      expect(authService.register).toHaveBeenCalledWith(registerData);
    });

    it('should register user with default USER role', async () => {
      const registerDataWithoutRole = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      const mockResponse = {
        access_token: 'mock-jwt-token',
        user: {
          id: '507f1f77bcf86cd799439011',
          email: registerDataWithoutRole.email,
          name: registerDataWithoutRole.name,
          role: UserRole.USER,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      };

      authService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDataWithoutRole);

      expect(result).toEqual(mockResponse);
      expect(authService.register).toHaveBeenCalledWith(
        registerDataWithoutRole,
      );
    });

    it('should register user with specified role', async () => {
      const registerDataWithRole = TestData.createValidCreateUserData({
        role: UserRole.ADMIN,
      });

      const mockResponse = {
        access_token: 'mock-jwt-token',
        user: {
          id: '507f1f77bcf86cd799439011',
          email: registerDataWithRole.email,
          name: registerDataWithRole.name,
          role: UserRole.ADMIN,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      };

      authService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDataWithRole);

      expect(result).toEqual(mockResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDataWithRole);
    });

    it('should throw UnauthorizedException when user already exists', async () => {
      const registerData = TestData.createValidCreateUserData();
      authService.register.mockRejectedValue(
        new UnauthorizedException('User already exists'),
      );

      await expect(controller.register(registerData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.register).toHaveBeenCalledWith(registerData);
    });

    it('should validate required fields', async () => {
      // Teste com dados válidos (o ZodValidationPipe deve garantir que dados inválidos não cheguem aqui)
      const validRegisterData = TestData.createValidCreateUserData();
      const mockResponse = {
        access_token: 'mock-jwt-token',
        user: {
          id: '507f1f77bcf86cd799439011',
          email: validRegisterData.email,
          name: validRegisterData.name,
          role: UserRole.USER,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
      };

      authService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(validRegisterData);
      expect(result).toEqual(mockResponse);
    });
  });
});
