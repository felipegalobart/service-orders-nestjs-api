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

- ✅ **CRUD completo** para usuários e pessoas (clientes/fornecedores)
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
- ✅ **Módulo Person** completo (clientes e fornecedores)
- ✅ **Soft delete** para preservação de dados

### 🔧 **Qualidade de Código**

- ✅ **TypeScript** com tipagem forte
- ✅ **ESLint** com regras customizadas
- ✅ **Prettier** para formatação automática
- ✅ **Convenções** de nomenclatura (prefixo 'I' para interfaces)
- ✅ **Clean Architecture** implementada

### 🧪 **Testes Automatizados**

- ✅ **49 testes unitários** com 100% de sucesso
- ✅ **35 testes E2E** com 92% de sucesso
- ✅ **Cobertura de código** 82%+
- ✅ **Jest** configurado para unit e E2E
- ✅ **MongoDB Memory Server** para testes isolados
- ✅ **Mocks e fixtures** padronizados
- ✅ **Execução rápida** (< 2 segundos)

### 📚 **Documentação**

- ✅ **Coleção Postman** completa para usuários e pessoas
- ✅ **Guias** de configuração e troubleshooting
- ✅ **Exemplos** de uso da API
- ✅ **Scripts de teste** automatizados
- ✅ **Documentação técnica** detalhada do módulo Person
- ✅ **Guia de testes** com collection Postman específica

## 🏗️ Arquitetura

### **📐 Clean Architecture**

```text
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
├── person/                    # Módulo de pessoas (clientes/fornecedores)
│   ├── schemas/              # Schemas e interfaces
│   │   ├── person.schema.ts  # Schema principal
│   │   ├── address.schema.ts # Schema de endereços
│   │   ├── contact.schema.ts # Schema de contatos
│   │   └── models/
│   │       └── person.interface.ts
│   ├── repositories/         # Camada de dados
│   │   ├── person.repository.ts
│   │   └── mongoose/
│   │       └── person.mongoose.repository.ts
│   ├── utils/                # Utilitários
│   │   ├── text-normalizer.ts
│   │   └── text-normalizer.example.ts
│   ├── person.service.ts     # Lógica de negócio
│   ├── person.controller.ts  # Controlador REST
│   ├── person.module.ts      # Módulo NestJS
│   └── index.ts              # Exports do módulo
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

#### **👤 Person Management (Clientes/Fornecedores)**

| Método   | Endpoint                         | Descrição                    | Autenticação | Roles    | Rate Limit |
| -------- | -------------------------------- | ---------------------------- | ------------ | -------- | ---------- |
| `POST`   | `/persons`                       | Criar pessoa                 | ✅ JWT       | Qualquer | 10/min     |
| `GET`    | `/persons`                       | Listar pessoas (paginado)    | ✅ JWT       | Qualquer | 10/min     |
| `GET`    | `/persons/:id`                   | Buscar pessoa por ID         | ✅ JWT       | Qualquer | 10/min     |
| `PUT`    | `/persons/:id`                   | Atualizar pessoa             | ✅ JWT       | Qualquer | 10/min     |
| `DELETE` | `/persons/:id`                   | Deletar pessoa (soft delete) | ✅ JWT       | Qualquer | 3/min      |
| `GET`    | `/persons/search/name`           | Buscar por nome              | ✅ JWT       | Qualquer | 10/min     |
| `GET`    | `/persons/search/document`       | Buscar por documento         | ✅ JWT       | Qualquer | 10/min     |
| `GET`    | `/persons/search/corporate-name` | Buscar por razão social      | ✅ JWT       | Qualquer | 10/min     |
| `GET`    | `/persons/search/phone`          | Buscar por telefone          | ✅ JWT       | Qualquer | 10/min     |
| `GET`    | `/persons/search`                | Busca unificada              | ✅ JWT       | Qualquer | 10/min     |

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

#### **Pessoa (Person) - Clientes/Fornecedores**

```typescript
interface IPerson {
  id: string; // ID único (gerado automaticamente)
  type: 'customer' | 'supplier'; // Tipo: cliente ou fornecedor
  name: string; // Nome da pessoa física ou nome fantasia
  document?: string; // CPF ou CNPJ (único quando preenchido)
  corporateName?: string; // Razão Social
  tradeName?: string; // Nome Fantasia
  stateRegistration?: string; // Inscrição Estadual
  municipalRegistration?: string; // Inscrição Municipal
  isExemptFromIE?: boolean; // Isento de Inscrição Estadual
  pessoaJuridica: boolean; // Indica se é pessoa jurídica
  blacklist: boolean; // Indica se está em blacklist
  isActive: boolean; // Indica se está ativo
  deletedAt?: Date; // Data do soft delete
  notes?: string; // Observações gerais
  addresses: IAddress[]; // Lista de endereços
  contacts: IContact[]; // Lista de contatos
  createdAt?: Date; // Data de criação
  updatedAt?: Date; // Data de atualização
}

interface IAddress {
  street?: string; // Nome da rua
  number?: string; // Número
  complement?: string; // Complemento
  neighborhood?: string; // Bairro
  city?: string; // Cidade
  state?: string; // Estado
  zipCode?: string; // CEP
  country?: string; // País (padrão: "Brasil")
  isDefault: boolean; // Endereço principal (padrão: true)
}

interface IContact {
  name?: string; // Nome do contato
  phone?: string; // Telefone
  email?: string; // Email (com validação regex)
  sector?: string; // Setor (ex: "Vendas", "Financeiro")
  isWhatsApp?: boolean; // É WhatsApp? (padrão: false)
  isDefault: boolean; // Contato principal (padrão: true)
}
```

### **📝 Exemplos de Uso**

#### **Criar Cliente (Pessoa Física)**

```bash
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "customer",
    "name": "João Silva",
    "document": "123.456.789-00",
    "pessoaJuridica": false,
    "blacklist": false,
    "notes": "Cliente VIP",
    "addresses": [
      {
        "street": "Rua das Flores",
        "number": "123",
        "complement": "Apto 45",
        "neighborhood": "Centro",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01234-567",
        "country": "Brasil",
        "isDefault": true
      }
    ],
    "contacts": [
      {
        "name": "João Silva",
        "phone": "(11) 99999-9999",
        "email": "joao@email.com",
        "sector": "Comercial",
        "isWhatsApp": true,
        "isDefault": true
      }
    ]
  }'
```

#### **Criar Fornecedor (Pessoa Jurídica)**

```bash
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "supplier",
    "name": "Fornecedor ABC Ltda",
    "document": "12.345.678/0001-90",
    "corporateName": "Fornecedor ABC Ltda",
    "tradeName": "ABC Fornecedor",
    "stateRegistration": "123.456.789.012",
    "municipalRegistration": "987654321",
    "isExemptFromIE": false,
    "pessoaJuridica": true,
    "blacklist": false,
    "notes": "Fornecedor de materiais",
    "addresses": [
      {
        "street": "Av. Industrial",
        "number": "1000",
        "neighborhood": "Distrito Industrial",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "04567-890",
        "country": "Brasil",
        "isDefault": true
      }
    ],
    "contacts": [
      {
        "name": "Maria Santos",
        "phone": "(11) 88888-8888",
        "email": "maria@abcfornecedor.com",
        "sector": "Vendas",
        "isWhatsApp": false,
        "isDefault": true
      }
    ]
  }'
```

#### **Buscar Pessoas por Nome**

```bash
curl -X GET "http://localhost:3000/persons/search/name?q=João" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### **Listar Pessoas com Filtros**

```bash
curl -X GET "http://localhost:3000/persons?type=customer&pessoaJuridica=false&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

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

### **✅ Status dos Testes**

- **49 testes unitários** passando (100%) ✅
- **35 testes E2E** passando (92%) ✅
- **Cobertura de código**: 82%+ ✅
- **Tempo de execução**: < 2 segundos ✅

### **🔧 Executar Testes**

```bash
# Todos os testes
npm run test

# Apenas testes unitários (recomendado para desenvolvimento)
npm run test:unit

# Apenas testes E2E
npm run test:e2e

# Com cobertura de código
npm run test:cov

# Modo watch (desenvolvimento)
npm run test:watch
```

### **📚 Documentação de Testes**

Consulte a [documentação completa de testes](docs/testing/README.md) para:

- Guias de execução
- Análise detalhada dos testes
- Resultados e métricas
- Solução de problemas

### **📋 Coleções Postman**

#### **Coleção Principal**

Importe a coleção `postman-collection.json` no Postman para testar endpoints de usuários e autenticação:

1. **Abrir Postman**
2. **Importar** → `postman-collection.json`
3. **Configurar** variável `{{baseUrl}}` = `http://localhost:3000`
4. **Executar** testes

#### **Coleção do Módulo Person**

Importe a coleção `postman-person-collection.json` para testar o módulo de pessoas (clientes/fornecedores):

1. **Abrir Postman**
2. **Importar** → `postman-person-collection.json`
3. **Configurar** variável `{{baseUrl}}` = `http://localhost:3000`
4. **Executar** testes

**📚 Documentação completa:** [Guia do Postman - Módulo Person](./docs/api/POSTMAN_GUIDE.md)

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

# Criar cliente (após login)
curl -X POST http://localhost:3000/persons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "customer",
    "name": "João Silva",
    "pessoaJuridica": false,
    "addresses": [{"street": "Rua Teste", "number": "123", "city": "São Paulo", "state": "SP", "isDefault": true}],
    "contacts": [{"name": "João", "phone": "(11) 99999-9999", "email": "joao@test.com", "sector": "Comercial", "isDefault": true}]
  }'

# Buscar pessoas por nome
curl -X GET "http://localhost:3000/persons/search/name?q=João" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Listar pessoas
curl -X GET "http://localhost:3000/persons?type=customer&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
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

```text
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
- **[👤 Módulo Person](./docs/api/PERSON_MODULE.md)** - Documentação completa do módulo de pessoas
- **[📮 Guia Postman - Person](./docs/api/POSTMAN_GUIDE.md)** - Guia detalhado da collection Postman

### **🔧 Ferramentas de Desenvolvimento**

- **VS Code Extensions**: Prettier, ESLint, MongoDB for VS Code
- **Postman**: Coleções completas para testes da API (usuários e pessoas)
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

## Desenvolvido com ❤️ usando NestJS, MongoDB, TypeScript e Rate Limiting

[![NestJS](https://nestjs.com/img/logo-small.svg)](https://nestjs.com/)
