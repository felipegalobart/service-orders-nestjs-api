import { UserRole } from '../auth/enums/user-role.enum';
import { IUser } from '../user/schemas/models/user.interface';

export const mockUserRepository = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      mongodbUri: 'mongodb://localhost:27017/test',
      jwtSecret: 'test-secret',
      jwtExpiresIn: '1h',
      port: 3000,
      nodeEnv: 'test',
    };
    return config[key];
  }),
};

export const createMockUser = (overrides: Partial<IUser> = {}): IUser => ({
  id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  password: '$2b$10$hashedpassword',
  name: 'Test User',
  role: UserRole.USER,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  ...overrides,
});

export const createMockUserWithoutPassword = (
  overrides: Partial<IUser> = {},
): Omit<IUser, 'password'> => {
  const user = createMockUser(overrides);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const mockRequest = {
  user: createMockUserWithoutPassword(),
  headers: {},
  body: {},
  params: {},
  query: {},
};

export const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
};
