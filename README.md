# 🛠️ Service Orders NestJS API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

> **Sistema completo de gerenciamento de ordens de serviço desenvolvido em NestJS com MongoDB, autenticação JWT e seguindo padrões de Clean Architecture.**

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

- ✅ **CRUD completo** para produtos e usuários
- ✅ **Paginação** automática
- ✅ **Validação** de dados de entrada com Zod
- ✅ **Tratamento de erros** padronizado
- ✅ **Respostas JSON** consistentes

### 🔐 **Sistema de Autenticação**

- ✅ **JWT Authentication** completo
- ✅ **Registro de usuários** com bcrypt
- ✅ **Login seguro** com validação
- ✅ **Proteção de rotas** com Guards
- ✅ **Middleware** de autenticação

### 🗃️ **Banco de Dados**

- ✅ **MongoDB** com Mongoose
- ✅ **Schemas** tipados com TypeScript
- ✅ **Validações** de campos obrigatórios
- ✅ **Índices** otimizados
- ✅ **Middleware** de criptografia de senhas

### 🔧 **Qualidade de Código**

- ✅ **TypeScript** com tipagem forte
- ✅ **ESLint** com regras customizadas
- ✅ **Prettier** para formatação automática
- ✅ **Convenções** de nomenclatura (prefixo 'I' para interfaces)
- ✅ **Repository Pattern** implementado

### 📚 **Documentação**

- ✅ **Coleção Postman** completa
- ✅ **Guias** de configuração e troubleshooting
- ✅ **Exemplos** de uso da API

## 🏗️ Arquitetura

### **📐 Clean Architecture**

```
src/
├── config/                    # Configurações globais
│   ├── app.config.ts         # Configuração da aplicação
│   └── config-example.service.ts
├── stock/                     # Módulo de estoque
│   ├── controllers/          # Controladores REST
│   │   └── stock.controller.ts
│   ├── services/             # Lógica de negócio
│   │   └── stock.service.ts
│   ├── repositories/         # Camada de dados
│   │   ├── product.repository.ts
│   │   └── mongoose/
│   │       └── product.mongoose.repository.ts
│   ├── schemas/              # Schemas e interfaces
│   │   ├── models/
│   │   │   └── product.interface.ts
│   │   └── product.schema.ts
│   └── stock.module.ts
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
│   │   └── jwt-auth.guard.ts
│   ├── decorators/           # Decorators customizados
│   │   └── current-user.decorator.ts
│   └── auth.module.ts
├── shared/                    # Recursos compartilhados
│   ├── filters/              # Filtros globais
│   │   └── http-exception.filter.ts
│   └── pipe/                 # Pipes customizados
│       └── zod-validation.pipe.ts
└── app.module.ts             # Módulo principal
```

### **🔄 Padrões Implementados**

- **Repository Pattern** - Abstração de acesso a dados
- **Dependency Injection** - Inversão de controle
- **Separation of Concerns** - Separação de responsabilidades
- **Interface Segregation** - Interfaces específicas

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

# Configurar MongoDB (editar .env)
MONGODB_URI=mongodb://localhost:27017/stock-management
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
# Testar API
curl http://localhost:3000/

# Listar produtos
curl http://localhost:3000/stock
```

## 📚 Documentação da API

### **🔗 Endpoints Disponíveis**

#### **🏪 Stock Management**
| Método   | Endpoint     | Descrição                  |
| -------- | ------------ | -------------------------- |
| `GET`    | `/`          | Health check               |
| `GET`    | `/stock`     | Listar produtos (paginado) |
| `GET`    | `/stock/:id` | Buscar produto por ID      |
| `POST`   | `/stock`     | Criar novo produto         |
| `PUT`    | `/stock/:id` | Atualizar estoque          |
| `DELETE` | `/stock/:id` | Deletar produto            |

#### **👥 User Management**
| Método   | Endpoint     | Descrição                  |
| -------- | ------------ | -------------------------- |
| `GET`    | `/users/:id` | Buscar usuário por ID      |
| `PUT`    | `/users/:id` | Atualizar usuário          |
| `DELETE` | `/users/:id` | Deletar usuário            |

#### **🔐 Authentication**
| Método   | Endpoint     | Descrição                  |
| -------- | ------------ | -------------------------- |
| `POST`   | `/auth/login`    | Login de usuário           |
| `POST`   | `/auth/register` | Registro de usuário        |

### **📦 Modelo de Dados**

#### **Usuário (User)**

```typescript
interface IUser {
  id?: string; // ID único (gerado automaticamente)
  email: string; // Email do usuário (obrigatório, único)
  password: string; // Senha criptografada (obrigatório)
  name: string; // Nome do usuário (obrigatório)
  createdAt?: Date; // Data de criação
  updatedAt?: Date; // Data de atualização
}
```

#### **Produto (Product)**

```typescript
interface IProduct {
  id?: string; // ID único (gerado automaticamente)
  name: string; // Nome do produto (obrigatório)
  quantity: number; // Quantidade em estoque (obrigatório)
  relationalId: number; // ID relacional único (obrigatório)
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
    "name": "João Silva"
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

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68cb3e5ff3a1b5397d4cbc49",
    "email": "user@example.com",
    "name": "João Silva",
    "createdAt": "2025-09-18T15:30:00.000Z",
    "updatedAt": "2025-09-18T15:30:00.000Z"
  }
}
```

#### **Criar Produto**

```bash
curl -X POST http://localhost:3000/stock \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "quantity": 50,
    "relationalId": 1001
  }'
```

**Resposta:**

```json
{
  "_id": "68cb3e5ff3a1b5397d4cbc49",
  "name": "iPhone 15 Pro",
  "quantity": 50,
  "relationalId": 1001,
  "__v": 0
}
```

#### **Listar Produtos**

```bash
curl "http://localhost:3000/stock?limit=10&page=1"
```

**Resposta:**

```json
[
  {
    "_id": "68cb3e5ff3a1b5397d4cbc49",
    "name": "iPhone 15 Pro",
    "quantity": 50,
    "relationalId": 1001,
    "__v": 0
  }
]
```

#### **Atualizar Estoque**

```bash
curl -X PUT http://localhost:3000/stock/68cb3e5ff3a1b5397d4cbc49 \
  -H "Content-Type: application/json" \
  -d '{"stock": 75}'
```

**Resposta:**

```json
{
  "_id": "68cb3e5ff3a1b5397d4cbc49",
  "name": "iPhone 15 Pro",
  "quantity": 75,
  "relationalId": 1001,
  "__v": 0
}
```

### **⚠️ Códigos de Erro**

| Código | Descrição                |
| ------ | ------------------------ |
| `200`  | Sucesso                  |
| `201`  | Criado com sucesso       |
| `404`  | Produto não encontrado   |
| `500`  | Erro interno do servidor |

## 🛠️ Configuração

### **📄 Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```bash
# Application Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/stock-management

# JWT Configuration (para autenticação futura)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# API Configuration
API_PREFIX=api/v1

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

### **🗃️ Configuração MongoDB**

#### **Opção 1: MongoDB Local (Desenvolvimento)**

```bash
# Instalar MongoDB
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb-community

# Configurar .env
MONGODB_URI=mongodb://localhost:27017/stock-management
```

#### **Opção 2: MongoDB Atlas (Produção)**

```bash
# Configurar .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-management
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

# Criar produto
curl -X POST http://localhost:3000/stock \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","quantity":10,"relationalId":123}'

# Listar produtos
curl http://localhost:3000/stock

# Buscar produto específico
curl http://localhost:3000/stock/PRODUCT_ID

# Atualizar estoque
curl -X PUT http://localhost:3000/stock/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"stock":20}'

# Deletar produto
curl -X DELETE http://localhost:3000/stock/PRODUCT_ID
```

## 📁 Estrutura do Projeto

```
service-orders-nestjs-api/
├── src/
│   ├── config/                    # Configurações
│   │   ├── app.config.ts         # Configuração principal
│   │   └── config-example.service.ts
│   ├── stock/                     # Módulo de estoque
│   │   ├── controllers/          # Controladores REST
│   │   ├── services/             # Serviços de negócio
│   │   ├── repositories/         # Repositórios de dados
│   │   ├── schemas/              # Schemas MongoDB
│   │   └── stock.module.ts       # Módulo de estoque
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
│   │   └── auth.module.ts        # Módulo de autenticação
│   ├── shared/                   # Recursos compartilhados
│   │   ├── filters/              # Filtros globais
│   │   └── pipe/                 # Pipes customizados
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

- **[CONFIG.md](./CONFIG.md)** - Guia de configuração de variáveis de ambiente
- **[PRETTIER_SETUP.md](./PRETTIER_SETUP.md)** - Configuração de formatação automática
- **[NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md)** - Convenções de nomenclatura
- **[POSTMAN_GUIDE.md](./POSTMAN_GUIDE.md)** - Guia completo do Postman
- **[MONGODB_TROUBLESHOOTING.md](./MONGODB_TROUBLESHOOTING.md)** - Resolução de problemas MongoDB

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
- ✅ **Interfaces** com prefixo 'I' (ex: `IProduct`)
- ✅ **Formatação** automática com Prettier
- ✅ **Linting** com ESLint
- ✅ **Commits** seguindo Conventional Commits

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🎯 Status do Projeto

- ✅ **API REST** completa e funcional
- ✅ **Sistema de autenticação JWT** implementado
- ✅ **Banco de dados** MongoDB configurado
- ✅ **Documentação** completa
- ✅ **Testes** via Postman
- ✅ **Qualidade de código** implementada
- ✅ **Arquitetura** limpa e escalável
- ✅ **Validação** com Zod
- ✅ **Repository Pattern** implementado
- ✅ **Filtros de exceção** globais

## 🚀 Próximos Passos

- [ ] **Swagger** para documentação interativa
- [ ] **Testes unitários** automatizados
- [ ] **Logs** estruturados
- [ ] **Docker** para containerização
- [ ] **CI/CD** com GitHub Actions
- [ ] **Rate limiting** para segurança
- [ ] **Cache** com Redis
- [ ] **WebSockets** para tempo real

---

**Desenvolvido com ❤️ usando NestJS, MongoDB e TypeScript**

<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>
