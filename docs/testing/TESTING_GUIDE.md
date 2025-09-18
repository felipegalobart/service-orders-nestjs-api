# 🧪 Guia de Testes - Service Orders NestJS API

Este guia explica como executar e entender os testes implementados no projeto.

## 📋 Índice

- [🚀 Executando Testes](#-executando-testes)
- [📁 Estrutura de Testes](#-estrutura-de-testes)
- [🔧 Tipos de Testes](#-tipos-de-testes)
- [📊 Cobertura de Código](#-cobertura-de-código)
- [🛠️ Configuração](#️-configuração)
- [📝 Escrevendo Novos Testes](#-escrevendo-novos-testes)

## 🚀 Executando Testes

### **Comandos Disponíveis**

```bash
# Executar todos os testes
npm run test

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes de integração (E2E)
npm run test:e2e

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com cobertura de código
npm run test:cov

# Executar testes em modo debug
npm run test:debug

# Executar testes para CI/CD
npm run test:ci
```

### **Primeira Execução**

```bash
# Instalar dependências (se ainda não instaladas)
npm install

# Executar todos os testes
npm run test
```

## 📁 Estrutura de Testes

```
src/
├── test-utils/                    # Utilitários de teste
│   ├── test-database.ts          # Configuração do banco de teste
│   ├── test-data.ts              # Dados de teste padronizados
│   ├── mocks.ts                  # Mocks e stubs
│   └── test-setup.ts             # Configuração global dos testes
├── auth/
│   ├── auth.service.spec.ts      # Testes unitários do AuthService
│   └── auth.controller.spec.ts   # Testes unitários do AuthController
├── user/
│   ├── user.service.spec.ts      # Testes unitários do UserService
│   └── user.controller.spec.ts   # Testes unitários do UserController
└── ...

test/
├── auth.e2e-spec.ts              # Testes E2E de autenticação
├── user.e2e-spec.ts              # Testes E2E de usuários
└── jest-e2e.json                 # Configuração Jest para E2E

jest.config.js                    # Configuração principal do Jest
```

## 🔧 Tipos de Testes

### **1. Testes Unitários (`.spec.ts`)**

Testam componentes isolados com mocks:

```typescript
describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository, // Mock do repositório
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  it('should return user when found by email', async () => {
    const mockUser = TestData.createValidUser();
    userRepository.findByEmail.mockResolvedValue(mockUser);

    const result = await service.findByEmail('test@example.com');

    expect(result).toEqual(mockUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });
});
```

**Características:**

- ✅ Rápidos (< 1ms por teste)
- ✅ Isolados (sem dependências externas)
- ✅ Determinísticos
- ✅ Testam lógica de negócio

### **2. Testes de Integração (`.e2e-spec.ts`)**

Testam fluxos completos com banco real:

```typescript
describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestModule([AppModule]);
    app = await createTestApp(moduleFixture);
  });

  it('should register a new user successfully', () => {
    const userData = TestData.createValidCreateUserData();

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).not.toHaveProperty('password');
      });
  });
});
```

**Características:**

- ✅ Testam fluxos completos
- ✅ Usam banco de dados real (MongoDB Memory Server)
- ✅ Testam autenticação e autorização
- ✅ Testam validação de dados
- ✅ Testam rate limiting

## 📊 Cobertura de Código

### **Visualizar Cobertura**

```bash
# Executar testes com cobertura
npm run test:cov

# Abrir relatório HTML
open coverage/lcov-report/index.html
```

### **Métricas de Cobertura**

- **Statements**: 85%+
- **Branches**: 80%+
- **Functions**: 90%+
- **Lines**: 85%+

### **Arquivos Excluídos da Cobertura**

```javascript
// jest.config.js
collectCoverageFrom: [
  'src/**/*.(t|j)s',
  '!src/**/*.spec.ts',        // Arquivos de teste
  '!src/**/*.interface.ts',   // Interfaces TypeScript
  '!src/main.ts',             // Ponto de entrada
  '!src/test-utils/**',       // Utilitários de teste
],
```

## 🛠️ Configuração

### **Jest Configuration (`jest.config.js`)**

```javascript
module.exports = {
  displayName: 'Service Orders API',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts', // Testes unitários
    '<rootDir>/test/**/*.e2e-spec.ts', // Testes E2E
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/test-setup.ts'],
  testTimeout: 30000,
  collectCoverageFrom: [
    'src/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/*.interface.ts',
    '!src/main.ts',
    '!src/test-utils/**',
  ],
};
```

### **Banco de Dados para Testes**

```typescript
// test-utils/test-database.ts
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
}
```

**Características:**

- ✅ Banco MongoDB em memória
- ✅ Isolamento entre testes
- ✅ Configuração automática
- ✅ Limpeza automática

## 📝 Escrevendo Novos Testes

### **1. Teste Unitário de Service**

```typescript
// src/meu-service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MeuService } from './meu-service';
import { TestData } from './test-utils/test-data';

describe('MeuService', () => {
  let service: MeuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeuService],
    }).compile();

    service = module.get<MeuService>(MeuService);
  });

  it('should do something', () => {
    // Arrange
    const input = TestData.createValidInput();

    // Act
    const result = service.doSomething(input);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
```

### **2. Teste Unitário de Controller**

```typescript
// src/meu-controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MeuController } from './meu-controller';
import { MeuService } from './meu-service';
import { TestData } from './test-utils/test-data';

describe('MeuController', () => {
  let controller: MeuController;
  let service: jest.Mocked<MeuService>;

  beforeEach(async () => {
    const mockService = {
      doSomething: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeuController],
      providers: [
        {
          provide: MeuService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MeuController>(MeuController);
    service = module.get(MeuService);
  });

  it('should call service method', async () => {
    const mockResult = TestData.createValidResult();
    service.doSomething.mockResolvedValue(mockResult);

    const result = await controller.getSomething();

    expect(result).toEqual(mockResult);
    expect(service.doSomething).toHaveBeenCalled();
  });
});
```

### **3. Teste E2E**

```typescript
// test/meu-modulo.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createTestModule,
  createTestApp,
  TestDatabase,
} from '../src/test-utils/test-database';
import { AppModule } from '../src/app.module';
import { TestData } from '../src/test-utils/test-data';

describe('MeuModulo (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestModule([AppModule]);
    app = await createTestApp(moduleFixture);

    // Setup de dados de teste se necessário
    await setupTestData();
  });

  afterAll(async () => {
    await app.close();
    await TestDatabase.teardown();
  });

  it('should create resource', () => {
    const resourceData = TestData.createValidResourceData();

    return request(app.getHttpServer())
      .post('/api/resources')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(resourceData)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', resourceData.name);
      });
  });
});
```

## 🎯 Boas Práticas

### **1. Organização de Testes**

```typescript
describe('UserService', () => {
  describe('findByEmail', () => {
    it('should return user when found', () => {});
    it('should return null when not found', () => {});
  });

  describe('create', () => {
    it('should create user successfully', () => {});
    it('should throw error when email exists', () => {});
  });
});
```

### **2. Nomenclatura**

- **Descritiva**: `should return user when found by valid email`
- **Específica**: `should return 401 when token is invalid`
- **Contextualizada**: `should allow admin to delete any user`

### **3. Dados de Teste**

```typescript
// Usar TestData para dados consistentes
const userData = TestData.createValidCreateUserData({
  email: 'specific@example.com',
  role: UserRole.ADMIN,
});

// Usar mocks para dependências
userRepository.findByEmail.mockResolvedValue(mockUser);
```

### **4. Asserções**

```typescript
// Asserções específicas
expect(result).toEqual(expectedUser);
expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);

// Verificar propriedades
expect(response.body).toHaveProperty('access_token');
expect(response.body.user).not.toHaveProperty('password');
```

### **5. Limpeza**

```typescript
afterEach(() => {
  jest.clearAllMocks(); // Limpar mocks
});

afterAll(async () => {
  await TestDatabase.teardown(); // Limpar banco
});
```

## 🚨 Troubleshooting

### **Problemas Comuns**

1. **Timeout nos testes E2E**

   ```javascript
   // jest.config.js
   testTimeout: 30000, // Aumentar timeout
   ```

2. **Banco de dados não limpa**

   ```typescript
   // Garantir que TestDatabase.teardown() é chamado
   afterAll(async () => {
     await TestDatabase.teardown();
   });
   ```

3. **Mocks não funcionando**

   ```typescript
   // Verificar se o mock está configurado corretamente
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

4. **Dependências não encontradas**
   ```bash
   # Instalar dependências de teste
   npm install --save-dev mongodb-memory-server
   ```

### **Debug de Testes**

```bash
# Executar teste específico
npm run test -- --testNamePattern="should login successfully"

# Executar arquivo específico
npm run test -- auth.service.spec.ts

# Debug mode
npm run test:debug
```

## 📈 Métricas de Qualidade

### **Meta de Cobertura**

- **Statements**: 85%+
- **Branches**: 80%+
- **Functions**: 90%+
- **Lines**: 85%+

### **Tipos de Testes por Módulo**

| Módulo | Testes Unitários       | Testes E2E         | Cobertura |
| ------ | ---------------------- | ------------------ | --------- |
| Auth   | ✅ Service, Controller | ✅ Login, Register | 90%+      |
| User   | ✅ Service, Controller | ✅ CRUD, Roles     | 90%+      |
| Shared | ✅ Pipes, Filters      | ✅ Validação       | 80%+      |

---

**🎉 Com esta estrutura de testes, você tem:**

- ✅ **Testes unitários** para lógica de negócio
- ✅ **Testes E2E** para fluxos completos
- ✅ **Cobertura de código** abrangente
- ✅ **Banco de dados** isolado para testes
- ✅ **Scripts** organizados e documentados
- ✅ **Boas práticas** implementadas

**Execute `npm run test` para começar! 🚀**
