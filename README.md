# 🛠️ Service Orders NestJS API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Rate Limiting](https://img.shields.io/badge/Rate%20Limiting-FF6B6B?style=for-the-badge&logo=shield&logoColor=white)](https://docs.nestjs.com/security/rate-limiting)

> **Sistema completo de gerenciamento de usuários com autenticação JWT, autorização baseada em roles, rate limiting e seguindo padrões de Clean Architecture.**

## 📋 Índice

- [🚀 Funcionalidades](#-funcionalidades)
- [🏗️ Arquitetura](#️-arquitetura)
- [⚡ Quick Start](#-quick-start)
- [📚 Documentação da API](#-documentação-da-api)
- [🛠️ Configuração](#️-configuração)
- [🧪 Testes](#-testes)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔧 Scripts Disponíveis](#-scripts-disponíveis)
- [📖 Guias Adicionais](#-guias-adicionais)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

## 🚀 Funcionalidades

### ✨ **API REST Completa**

- ✅ **CRUD completo** para usuários
- ✅ **Paginação** automática
- ✅ **Validação** de dados de entrada com Zod
- ✅ **Tratamento de erros** padronizado
- ✅ **Respostas JSON** consistentes

### 🔐 **Sistema de Autenticação Avançado**

- ✅ **JWT Authentication** completo
- ✅ **Registro de usuários** com bcrypt
- ✅ **Login seguro** com validação
- ✅ **Proteção global de rotas** com Guards
- ✅ **Rotas públicas** configuráveis
- ✅ **Middleware** de autenticação

### 🛡️ **Sistema de Autorização por Roles**

- ✅ **Roles hierárquicos** (ADMIN, USER, MODERATOR)
- ✅ **Guards de autorização** por endpoint
- ✅ **Decorators customizados** (@Roles, @Public)
- ✅ **Controle granular** de acesso
- ✅ **Proteção de endpoints** administrativos

### 🚫 **Rate Limiting e Segurança**

- ✅ **Rate limiting global** configurável
- ✅ **Limites específicos** por tipo de endpoint
- ✅ **Proteção contra força bruta**
- ✅ **Throttling por IP** e User-Agent
- ✅ **Status 429** para requisições limitadas

### 🗃️ **Banco de Dados**

- ✅ **MongoDB** com Mongoose
- ✅ **Schemas** tipados com TypeScript
- ✅ **Validações** de campos obrigatórios
- ✅ **Índices** otimizados
- ✅ **Middleware** de criptografia de senhas
- ✅ **Repository Pattern** implementado

### 🔧 **Qualidade de Código**

- ✅ **TypeScript** com tipagem forte
- ✅ **ESLint** com regras customizadas
- ✅ **Prettier** para formatação automática
- ✅ **Convenções** de nomenclatura (prefixo 'I' para interfaces)
- ✅ **Clean Architecture** implementada

### 📚 **Documentação**

- ✅ **Coleção Postman** completa
- ✅ **Guias** de configuração e troubleshooting
- ✅ **Exemplos** de uso da API
- ✅ **Scripts de teste** automatizados

## 🏗️ Arquitetura

### **📐 Clean Architecture**

```
src/
├── config/                    # Configurações globais
│   ├── app.config.ts         # Configuração da aplicação
│   └── config-example.service.ts
├── user/                      # Módulo de usuários
│   ├── controllers/          # Controladores REST
│   │   └── user.controller.ts
│   ├── services/             # Lógica de negócio
│   │   └── user.service.ts
│   ├── repositories/         # Camada de dados
│   │   ├── user.repository.ts
│   │   └── mongoose/
│   │       └── user.mongoose.repository.ts
│   ├── schemas/              # Schemas e interfaces
│   │   ├── models/
│   │   │   └── user.interface.ts
│   │   └── user.schema.ts
│   └── user.module.ts
├── auth/                      # Módulo de autenticação
│   ├── controllers/          # Controladores REST
│   │   └── auth.controller.ts
│   ├── services/             # Lógica de negócio
│   │   └── auth.service.ts
│   ├── strategies/           # Estratégias de autenticação
│   │   └── jwt.strategy.ts
│   ├── guards/               # Guards de proteção
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── decorators/           # Decorators customizados
│   │   ├── current-user.decorator.ts
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── enums/                # Enums de roles
│   │   └── user-role.enum.ts
│   └── auth.module.ts
├── shared/                    # Recursos compartilhados
│   ├── filters/              # Filtros globais
│   │   └── http-exception.filter.ts
│   ├── pipe/                 # Pipes customizados
│   │   └── zod-validation.pipe.ts
│   └── decorators/           # Decorators de throttling
│       └── throttle.decorator.ts
└── app.module.ts             # Módulo principal
```

### **🔄 Padrões Implementados**

- **Repository Pattern** - Abstração de acesso a dados
- **Dependency Injection** - Inversão de controle
- **Separation of Concerns** - Separação de responsabilidades
- **Interface Segregation** - Interfaces específicas
- **Guard Pattern** - Proteção de rotas
- **Decorator Pattern** - Metadados de configuração

## ⚡ Quick Start

### **1. 📥 Instalação**

```bash
# Clonar o repositório
git clone https://github.com/felipegalobart/service-orders-nestjs-api.git
cd service-orders-nestjs-api

# Instalar dependências
npm install
```

### **2. ⚙️ Configuração**

```bash
# Copiar arquivo de configuração
cp .env.example .env

# Configurar variáveis (editar .env)
MONGODB_URI=mongodb://localhost:27017/service-orders
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
```

### **3. 🚀 Execução**

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

### **4. 🧪 Teste**

```bash
# Executar todos os testes
npm run test

# Executar apenas testes unitários
npm run test:unit

# Executar apenas testes E2E
npm run test:e2e

# Executar testes com cobertura
npm run test:cov

# Executar todos os testes (script completo)
./run-tests.sh

# Health check manual
curl http://localhost:3000/

# Testar rate limiting
./test-rate-limiting.sh
```

**📚 Documentação completa:** [Guia de Testes](./docs/testing/TESTING_GUIDE.md)

## 📚 Documentação da API

### **🔗 Endpoints Disponíveis**

#### **🏠 Health Check**

| Método | Endpoint | Descrição    | Autenticação |
| ------ | -------- | ------------ | ------------ |
| `GET`  | `/`      | Health check | ❌ Público   |

#### **🔐 Authentication (Públicos)**

| Método | Endpoint         | Descrição           | Rate Limit |
| ------ | ---------------- | ------------------- | ---------- |
| `POST` | `/auth/login`    | Login de usuário    | 5/min      |
| `POST` | `/auth/register` | Registro de usuário | 5/min      |

#### **👥 User Management**

| Método   | Endpoint         | Descrição                | Autenticação | Roles         | Rate Limit |
| -------- | ---------------- | ------------------------ | ------------ | ------------- | ---------- |
| `GET`    | `/users/profile` | Perfil do usuário atual  | ✅ JWT       | Qualquer      | 10/min     |
| `GET`    | `/users/:id`     | Buscar usuário por ID    | ✅ JWT       | ADMIN         | 3/min      |
| `PUT`    | `/users/:id`     | Atualizar usuário        | ✅ JWT       | Próprio/ADMIN | 10/min     |
| `DELETE` | `/users/:id`     | Deletar usuário          | ✅ JWT       | ADMIN         | 3/min      |
| `GET`    | `/users`         | Listar todos os usuários | ✅ JWT       | ADMIN         | 3/min      |

### **📦 Modelo de Dados**

#### **Usuário (User)**

```typescript
interface IUser {
  id: string; // ID único (gerado automaticamente)
  email: string; // Email do usuário (obrigatório, único)
  password: string; // Senha criptografada (obrigatório)
  name: string; // Nome do usuário (obrigatório)
  role: UserRole; // Role do usuário (USER, ADMIN, MODERATOR)
  createdAt?: Date; // Data de criação
  updatedAt?: Date; // Data de atualização
}

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}
```

### **📝 Exemplos de Uso**

#### **Registrar Usuário**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "João Silva",
    "role": "user"
  }'
```

**Resposta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68cb3e5ff3a1b5397d4cbc49",
    "email": "user@example.com",
    "name": "João Silva",
    "role": "user",
    "createdAt": "2025-09-18T15:30:00.000Z",
    "updatedAt": "2025-09-18T15:30:00.000Z"
  }
}
```

#### **Login de Usuário**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### **Acessar Perfil (Protegido)**

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Listar Usuários (Admin)**

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

### **⚠️ Códigos de Erro**

| Código | Descrição                         |
| ------ | --------------------------------- |
| `200`  | Sucesso                           |
| `201`  | Criado com sucesso                |
| `401`  | Não autorizado (JWT inválido)     |
| `403`  | Acesso negado (role insuficiente) |
| `404`  | Recurso não encontrado            |
| `429`  | Rate limit excedido               |
| `500`  | Erro interno do servidor          |

## 🛠️ Configuração

### **📄 Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```bash
# Application Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/service-orders

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# API Configuration
API_PREFIX=api/v1

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug

# Rate Limiting Configuration
THROTTLER_TTL=60000
THROTTLER_LIMIT=10
```

### **🗃️ Configuração MongoDB**

#### **Opção 1: MongoDB Local (Desenvolvimento)**

```bash
# Instalar MongoDB
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb-community

# Configurar .env
MONGODB_URI=mongodb://localhost:27017/service-orders
```

#### **Opção 2: MongoDB Atlas (Produção)**

```bash
# Configurar .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/service-orders
```

## 🧪 Testes

### **📋 Coleção Postman**

Importe a coleção `postman-collection.json` no Postman para testar todos os endpoints:

1. **Abrir Postman**
2. **Importar** → `postman-collection.json`
3. **Configurar** variável `{{baseUrl}}` = `http://localhost:3000`
4. **Executar** testes

### **🔧 Testes via Terminal**

```bash
# Health check
curl http://localhost:3000/

# Testar rate limiting
./test-rate-limiting.sh

# Registrar usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### **🛡️ Teste de Rate Limiting**

```bash
# Executar script de teste
./test-rate-limiting.sh

# Ou testar manualmente
for i in {1..5}; do
  curl -X POST http://localhost:3000/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@example.com","password":"123456","name":"Test User"}'
done
```

## 📁 Estrutura do Projeto

```
service-orders-nestjs-api/
├── src/
│   ├── config/                    # Configurações
│   │   ├── app.config.ts         # Configuração principal
│   │   └── config-example.service.ts
│   ├── user/                     # Módulo de usuários
│   │   ├── controllers/          # Controladores REST
│   │   ├── services/             # Serviços de negócio
│   │   ├── repositories/         # Repositórios de dados
│   │   ├── schemas/              # Schemas MongoDB
│   │   └── user.module.ts        # Módulo de usuários
│   ├── auth/                     # Módulo de autenticação
│   │   ├── controllers/          # Controladores REST
│   │   ├── services/             # Serviços de negócio
│   │   ├── strategies/           # Estratégias JWT
│   │   ├── guards/               # Guards de proteção
│   │   ├── decorators/           # Decorators customizados
│   │   ├── enums/                # Enums de roles
│   │   └── auth.module.ts        # Módulo de autenticação
│   ├── shared/                   # Recursos compartilhados
│   │   ├── filters/              # Filtros globais
│   │   ├── pipe/                 # Pipes customizados
│   │   └── decorators/           # Decorators de throttling
│   ├── app.controller.ts         # Controller principal
│   ├── app.module.ts             # Módulo principal
│   ├── app.service.ts            # Serviço principal
│   └── main.ts                   # Arquivo de entrada
├── test/                         # Testes E2E
├── .env                          # Variáveis de ambiente
├── .env.example                  # Exemplo de configuração
├── .editorconfig                 # Configuração do editor
├── .prettierrc                   # Configuração Prettier
├── eslint.config.mjs             # Configuração ESLint
├── postman-collection.json       # Coleção Postman
├── test-rate-limiting.sh         # Script de teste de rate limiting
├── package.json                  # Dependências e scripts
└── README.md                     # Este arquivo
```

## 🔧 Scripts Disponíveis

### **🚀 Desenvolvimento**

```bash
npm run start:dev      # Iniciar em modo desenvolvimento
npm run start:debug    # Iniciar em modo debug
npm run build          # Compilar para produção
```

### **🎨 Formatação e Linting**

```bash
npm run format         # Formatar código com Prettier
npm run format:check   # Verificar formatação
npm run lint           # Corrigir problemas de linting
npm run lint:check     # Verificar problemas de linting
npm run format:lint    # Formatar + corrigir linting
```

### **🧪 Testes**

```bash
npm run test           # Executar testes unitários
npm run test:watch     # Executar testes em modo watch
npm run test:cov       # Executar testes com cobertura
npm run test:e2e       # Executar testes E2E
```

## 📖 Guias Adicionais

### **📚 Documentação Detalhada**

- **[📁 Documentação Completa](./docs/README.md)** - Índice de toda a documentação
- **[⚙️ Configuração](./docs/configuration/README.md)** - Setup e configuração do projeto
- **[📡 API](./docs/api/README.md)** - Documentação e uso da API
- **[🧪 Testes](./docs/testing/README.md)** - Como executar e escrever testes

### **🔧 Ferramentas de Desenvolvimento**

- **VS Code Extensions**: Prettier, ESLint, MongoDB for VS Code
- **Postman**: Coleção completa para testes da API
- **MongoDB Compass**: Interface gráfica para MongoDB

## 🤝 Contribuição

### **🔄 Como Contribuir**

1. **Fork** o projeto
2. **Criar** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abrir** um Pull Request

### **📋 Padrões de Código**

- ✅ **TypeScript** com tipagem forte
- ✅ **Interfaces** com prefixo 'I' (ex: `IUser`)
- ✅ **Formatação** automática com Prettier
- ✅ **Linting** com ESLint
- ✅ **Commits** seguindo Conventional Commits

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🎯 Status do Projeto

- ✅ **API REST** completa e funcional
- ✅ **Sistema de autenticação JWT** implementado
- ✅ **Sistema de autorização por roles** implementado
- ✅ **Rate limiting** configurado e testado
- ✅ **Banco de dados** MongoDB configurado
- ✅ **Documentação** completa
- ✅ **Testes** via Postman e scripts
- ✅ **Qualidade de código** implementada
- ✅ **Arquitetura** limpa e escalável
- ✅ **Validação** com Zod
- ✅ **Repository Pattern** implementado
- ✅ **Filtros de exceção** globais
- ✅ **Guards** de autenticação e autorização

## 🚀 Próximos Passos

- [ ] **Swagger** para documentação interativa
- [x] **Testes unitários** automatizados ✅
- [x] **Testes E2E** automatizados ✅
- [x] **Cobertura de código** implementada ✅
- [ ] **Logs** estruturados
- [ ] **Docker** para containerização
- [ ] **CI/CD** com GitHub Actions
- [ ] **Cache** com Redis
- [ ] **WebSockets** para tempo real
- [ ] **Helmet.js** para headers de segurança
- [ ] **Health checks** para monitoramento

---

**Desenvolvido com ❤️ usando NestJS, MongoDB, TypeScript e Rate Limiting**

<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>
