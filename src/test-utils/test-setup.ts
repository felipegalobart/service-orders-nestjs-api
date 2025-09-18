import { MongoMemoryServer } from 'mongodb-memory-server';

// Global test setup
beforeAll(async () => {
  // Increase timeout for database setup
  jest.setTimeout(30000);
});

afterAll(async () => {
  // Cleanup after all tests
  // Note: Individual test cleanup is handled in test-database.ts
});

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Mock console.error and console.warn to reduce test output noise
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;

  // Clear all mocks after each test
  jest.clearAllMocks();
});

// Global test utilities
global.testTimeout = 30000;
