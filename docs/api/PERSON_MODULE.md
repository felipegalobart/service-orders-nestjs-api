# 📋 Módulo Person - Documentação da API

## 📑 Índice

1. [🎯 Visão Geral](#-visão-geral)
2. [🏗️ Estrutura do Banco de Dados](#️-estrutura-do-banco-de-dados)
   - [Collection: `persons`](#collection-persons)
   - [Subdocumento: `addresses`](#subdocumento-addresses)
   - [Subdocumento: `contacts`](#subdocumento-contacts)
3. [🔍 Índices do Banco de Dados](#-índices-do-banco-de-dados)
4. [📊 Exemplos de Dados](#-exemplos-de-dados)
   - [Pessoa Física (Cliente) - Cadastro Mínimo](#pessoa-física-cliente---cadastro-mínimo)
   - [Pessoa Jurídica (Fornecedor) - Cadastro Completo](#pessoa-jurídica-fornecedor---cadastro-completo)
   - [Pessoa em Blacklist](#pessoa-em-blacklist)
5. [🚀 Endpoints da API](#-endpoints-da-api)
   - [1. Criar Pessoa](#1-criar-pessoa)
   - [2. Listar Pessoas](#2-listar-pessoas)
   - [3. Buscar Pessoa por ID](#3-buscar-pessoa-por-id)
   - [4. Atualizar Pessoa](#4-atualizar-pessoa)
   - [5. Deletar Pessoa (Soft Delete)](#5-deletar-pessoa-soft-delete)
6. [🔍 Endpoints de Busca](#-endpoints-de-busca)
   - [1. Buscar por Nome](#1-buscar-por-nome)
   - [2. Buscar por Documento](#2-buscar-por-documento)
   - [3. Buscar por Razão Social](#3-buscar-por-razão-social)
   - [4. Buscar por Telefone](#4-buscar-por-telefone)
   - [5. Busca Unificada](#5-busca-unificada)
7. [✅ Validações](#-validações)
   - [Validações de Email](#validações-de-email)
   - [Validações Condicionais](#validações-condicionais)
   - [Validações de Endereço](#validações-de-endereço)
   - [Validações de Contato](#validações-de-contato)
   - [Validações de Busca](#validações-de-busca)
   - [Validações de Paginação](#validações-de-paginação)
8. [🧪 Testes e Collection Postman](#-testes-e-collection-postman)
   - [Collection do Postman](#collection-do-postman)
   - [Status dos Testes](#status-dos-testes)
9. [🔧 Configurações Técnicas Atualizadas](#-configurações-técnicas-atualizadas)
   - [Estrutura de Arquivos Completa](#estrutura-de-arquivos-completa)
   - [Arquivos de Documentação](#arquivos-de-documentação)
   - [Dependências Utilizadas](#dependências-utilizadas)
   - [Configuração do Módulo Atualizada](#configuração-do-módulo-atualizada)
10. [🎯 Casos de Uso Implementados](#-casos-de-uso-implementados)
11. [📝 Notas Importantes](#-notas-importantes)
12. [🚀 Próximos Passos Sugeridos](#-próximos-passos-sugeridos)

---

## 🎯 Visão Geral

O módulo Person é responsável pelo cadastro e gerenciamento de pessoas físicas e jurídicas que podem ser clientes ou fornecedores. Este módulo permite cadastros flexíveis onde as informações podem ser preenchidas gradualmente conforme necessário.

## 🏗️ Estrutura do Banco de Dados

### Collection: `persons`

A collection `persons` armazena todas as informações de pessoas físicas e jurídicas, sejam clientes ou fornecedores.

#### Campos Principais

| Campo                   | Tipo     | Obrigatório | Padrão     | Descrição                              |
| ----------------------- | -------- | ----------- | ---------- | -------------------------------------- |
| `_id`                   | ObjectId | ✅          | Auto       | Identificador único do MongoDB         |
| `type`                  | String   | ✅          | "customer" | Tipo: "customer" ou "supplier"         |
| `name`                  | String   | ✅          | -          | Nome da pessoa física ou nome fantasia |
| `document`              | String   | ❌          | -          | CPF ou CNPJ (único quando preenchido)  |
| `corporateName`         | String   | ❌          | -          | Razão Social                           |
| `tradeName`             | String   | ❌          | -          | Nome Fantasia                          |
| `stateRegistration`     | String   | ❌          | -          | Inscrição Estadual                     |
| `municipalRegistration` | String   | ❌          | -          | Inscrição Municipal                    |
| `isExemptFromIE`        | Boolean  | ❌          | -          | Isento de Inscrição Estadual           |
| `pessoaJuridica`        | Boolean  | ✅          | -          | Indica se é pessoa jurídica            |
| `blacklist`             | Boolean  | ✅          | false      | Indica se está em blacklist            |
| `isActive`              | Boolean  | ✅          | true       | Indica se está ativo                   |
| `deletedAt`             | Date     | ❌          | -          | Data do soft delete                    |
| `notes`                 | String   | ❌          | -          | Observações gerais                     |
| `addresses`             | Array    | ✅          | []         | Lista de endereços                     |
| `contacts`              | Array    | ✅          | []         | Lista de contatos                      |
| `createdAt`             | Date     | ✅          | Auto       | Data de criação                        |
| `updatedAt`             | Date     | ✅          | Auto       | Data de atualização                    |

### Subdocumento: `addresses`

Cada pessoa pode ter múltiplos endereços.

| Campo          | Tipo    | Obrigatório | Padrão   | Descrição          |
| -------------- | ------- | ----------- | -------- | ------------------ |
| `street`       | String  | ❌          | -        | Nome da rua        |
| `number`       | String  | ❌          | -        | Número             |
| `complement`   | String  | ❌          | -        | Complemento        |
| `neighborhood` | String  | ❌          | -        | Bairro             |
| `city`         | String  | ❌          | -        | Cidade             |
| `state`        | String  | ❌          | -        | Estado             |
| `zipCode`      | String  | ❌          | -        | CEP                |
| `country`      | String  | ❌          | "Brasil" | País               |
| `isDefault`    | Boolean | ✅          | true     | Endereço principal |

### Subdocumento: `contacts`

Cada pessoa pode ter múltiplos contatos.

| Campo        | Tipo    | Obrigatório | Padrão | Descrição                          |
| ------------ | ------- | ----------- | ------ | ---------------------------------- |
| `name`       | String  | ❌          | -      | Nome do contato                    |
| `phone`      | String  | ❌          | -      | Telefone                           |
| `email`      | String  | ❌          | -      | Email (com validação regex)        |
| `sector`     | String  | ❌          | -      | Setor (ex: "Vendas", "Financeiro") |
| `isWhatsApp` | Boolean | ❌          | false  | É WhatsApp?                        |
| `isDefault`  | Boolean | ✅          | true   | Contato principal                  |

## 🔍 Índices do Banco de Dados

### Índices Principais

```javascript
// Busca por nome
{ name: "text" }

// Busca por documento (único, mas opcional)
{ document: 1 }, { unique: true, sparse: true }

// Busca por razão social
{ corporateName: "text" }

// Busca por telefone
{ "contacts.phone": 1 }

// Índices compostos para performance
{ type: 1, name: 1 }
{ isActive: 1, deletedAt: 1 }
{ blacklist: 1, isActive: 1 }
{ pessoaJuridica: 1, type: 1 }
{ createdAt: -1 }
```

## 📊 Exemplos de Dados

### Pessoa Física (Cliente) - Cadastro Mínimo

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "type": "customer",
  "name": "João Silva",
  "pessoaJuridica": false,
  "blacklist": false,
  "isActive": true,
  "addresses": [],
  "contacts": [],
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### Pessoa Jurídica (Fornecedor) - Cadastro Completo

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "type": "supplier",
  "name": "ABC Peças",
  "document": "12.345.678/0001-90",
  "corporateName": "ABC Peças Ltda",
  "tradeName": "ABC Peças",
  "stateRegistration": "123.456.789.012",
  "municipalRegistration": "987.654.321",
  "isExemptFromIE": false,
  "pessoaJuridica": true,
  "blacklist": false,
  "isActive": true,
  "notes": "Fornecedor de peças automotivas",
  "addresses": [
    {
      "street": "Av. Industrial",
      "number": "456",
      "neighborhood": "Zona Industrial",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "04567-890",
      "country": "Brasil",
      "isDefault": true
    }
  ],
  "contacts": [
    {
      "name": "Carlos Santos",
      "phone": "(11) 3333-4444",
      "email": "carlos@abcpecas.com",
      "sector": "Vendas",
      "isWhatsApp": true,
      "isDefault": true
    },
    {
      "name": "Ana Costa",
      "phone": "(11) 2222-3333",
      "email": "ana@abcpecas.com",
      "sector": "Financeiro",
      "isWhatsApp": false,
      "isDefault": false
    }
  ],
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### Pessoa em Blacklist

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "type": "customer",
  "name": "Cliente Problemático",
  "document": "111.222.333-44",
  "pessoaJuridica": false,
  "blacklist": true,
  "isActive": true,
  "notes": "Cliente em blacklist por inadimplência",
  "addresses": [],
  "contacts": [],
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

## 🚀 Endpoints da API

### Base URL

```text
/persons
```

### 1. Criar Pessoa

**POST** `/persons`

**Body:**

```json
{
  "type": "customer",
  "name": "João Silva",
  "document": "123.456.789-00",
  "corporateName": "João Silva Comércio Ltda",
  "tradeName": "Loja do João",
  "stateRegistration": "123.456.789.012",
  "municipalRegistration": "987.654.321",
  "isExemptFromIE": false,
  "pessoaJuridica": true,
  "blacklist": false,
  "notes": "Cliente preferencial",
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
      "sector": "Principal",
      "isWhatsApp": true,
      "isDefault": true
    }
  ]
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "type": "customer",
  "name": "João Silva",
  "document": "123.456.789-00",
  "corporateName": "João Silva Comércio Ltda",
  "tradeName": "Loja do João",
  "stateRegistration": "123.456.789.012",
  "municipalRegistration": "987.654.321",
  "isExemptFromIE": false,
  "pessoaJuridica": true,
  "blacklist": false,
  "isActive": true,
  "notes": "Cliente preferencial",
  "addresses": [...],
  "contacts": [...],
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### 2. Listar Pessoas

**GET** `/persons`

**Query Parameters:**

- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `type` (opcional): Filtrar por tipo ("customer" ou "supplier")
- `pessoaJuridica` (opcional): Filtrar por pessoa jurídica (true/false)
- `blacklist` (opcional): Filtrar por blacklist (true/false)

**Response:**

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "type": "customer",
      "name": "João Silva",
      "pessoaJuridica": true,
      "blacklist": false,
      "isActive": true,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 3. Buscar Pessoa por ID

**GET** `/persons/:id`

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "type": "customer",
  "name": "João Silva",
  "document": "123.456.789-00",
  "corporateName": "João Silva Comércio Ltda",
  "tradeName": "Loja do João",
  "stateRegistration": "123.456.789.012",
  "municipalRegistration": "987.654.321",
  "isExemptFromIE": false,
  "pessoaJuridica": true,
  "blacklist": false,
  "isActive": true,
  "notes": "Cliente preferencial",
  "addresses": [...],
  "contacts": [...],
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### 4. Atualizar Pessoa

**PUT** `/persons/:id`

**Body:** (mesmo formato do POST, campos opcionais)

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "type": "customer",
  "name": "João Silva Atualizado",
  "document": "123.456.789-00",
  "corporateName": "João Silva Comércio Ltda",
  "tradeName": "Loja do João",
  "stateRegistration": "123.456.789.012",
  "municipalRegistration": "987.654.321",
  "isExemptFromIE": false,
  "pessoaJuridica": true,
  "blacklist": false,
  "isActive": true,
  "notes": "Cliente preferencial",
  "addresses": [...],
  "contacts": [...],
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### 5. Deletar Pessoa (Soft Delete)

**DELETE** `/persons/:id`

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "type": "customer",
  "name": "João Silva",
  "isActive": false,
  "deletedAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

## 🔍 Endpoints de Busca

### 1. Buscar por Nome

**GET** `/persons/search/name?q=João`

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "type": "customer",
    "pessoaJuridica": true,
    "blacklist": false,
    "isActive": true
  }
]
```

### 2. Buscar por Documento

**GET** `/persons/search/document?q=123.456.789-00`

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "document": "123.456.789-00",
    "type": "customer",
    "pessoaJuridica": true,
    "blacklist": false,
    "isActive": true
  }
]
```

### 3. Buscar por Razão Social

**GET** `/persons/search/corporate-name?q=ABC Peças`

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "ABC Peças",
    "corporateName": "ABC Peças Ltda",
    "type": "supplier",
    "pessoaJuridica": true,
    "blacklist": false,
    "isActive": true
  }
]
```

### 4. Buscar por Telefone

**GET** `/persons/search/phone?q=(11) 99999-9999`

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "type": "customer",
    "pessoaJuridica": true,
    "blacklist": false,
    "isActive": true,
    "contacts": [
      {
        "name": "João Silva",
        "phone": "(11) 99999-9999",
        "email": "joao@email.com",
        "sector": "Principal",
        "isWhatsApp": true,
        "isDefault": true
      }
    ]
  }
]
```

### 5. Busca Unificada

**GET** `/persons/search?q=João`

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "João Silva",
    "type": "customer",
    "pessoaJuridica": true,
    "blacklist": false,
    "isActive": true
  }
]
```

## ✅ Validações

### Validações de Email

- Formato válido usando regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Campo opcional quando preenchido

### Validações Condicionais

- Se `isExemptFromIE = true`, `stateRegistration` deve estar vazio
- Se `isExemptFromIE = false`, `stateRegistration` é recomendado
- `document` deve ser único quando preenchido
- Campos obrigatórios: `name`, `pessoaJuridica`

### Validações de Endereço

- Todos os campos são opcionais
- Apenas um endereço pode ser `isDefault = true`
- `isDefault` tem valor padrão `true`
- Se endereço não está vazio, campos obrigatórios: `street`, `number`, `city`, `state`

### Validações de Contato

- Todos os campos são opcionais
- Apenas um contato pode ser `isDefault = true`
- `isDefault` tem valor padrão `true`
- Se contato não está vazio, campos obrigatórios: `name`, `phone`, `email`, `sector`

### Validações de Busca

- Termo de busca deve ter pelo menos 2 caracteres
- Busca por nome: case-insensitive (ignora maiúsculas/minúsculas)
- Busca por documento: exata (sem formatação)
- Busca por razão social: case-insensitive
- Busca por telefone: exata
- **Busca com acentos**: Use URL encoding (ex: `Jo%C3%A3o` para "João")

### Validações de Paginação

- Página deve ser maior que 0
- Limite deve estar entre 1 e 100
- Valores padrão: página 1, limite 10

## 🎯 Casos de Uso

### 1. Cadastro Mínimo

- Cliente pode ser cadastrado apenas com `name` e `type`
- Outros campos podem ser preenchidos posteriormente

### 2. Cadastro Completo

- Pessoa jurídica com todas as informações fiscais
- Múltiplos endereços e contatos

### 3. Blacklist

- Marcar clientes problemáticos
- Filtrar em relatórios e operações

### 4. Soft Delete

- Preservar dados para auditoria
- Recuperar dados se necessário

## 🔧 Configurações Técnicas

### Estrutura de Arquivos

```text
src/person/
├── schemas/
│   ├── person.schema.ts
│   ├── address.schema.ts
│   ├── contact.schema.ts
│   └── models/
│       └── person.interface.ts
├── repositories/
│   ├── person.repository.ts
│   └── mongoose/
│       └── person.mongoose.repository.ts
├── person.service.ts
├── person.controller.ts
└── person.module.ts
```

### Dependências

- `@nestjs/mongoose`: Integração com MongoDB
- `mongoose`: ODM para MongoDB
- `bcrypt`: Criptografia (se necessário)

### Configuração do Módulo

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
  ],
  providers: [
    {
      provide: PersonRepository,
      useClass: PersonMongooseRepository,
    },
    PersonService,
  ],
  controllers: [PersonController],
  exports: [PersonService],
})
export class PersonModule {}
```

## 🧪 Testes e Collection Postman

### Collection do Postman

Uma collection completa do Postman está disponível no arquivo `postman-person-collection.json` na raiz do projeto. Esta collection inclui:

#### 📁 Estrutura da Collection

1. **CRUD Operations**
   - ✅ Create Person - Customer (Pessoa física)
   - ✅ Create Person - Supplier (Pessoa jurídica)
   - ✅ Get All Persons (Com paginação)
   - ✅ Get Person by ID
   - ✅ Update Person
   - ✅ Delete Person (Soft delete)

2. **Search Operations**
   - ✅ Search by Name (Incluindo busca com acentos)
   - ✅ Search by Document (CPF/CNPJ)
   - ✅ Search by Corporate Name (Razão social)
   - ✅ Search by Phone
   - ✅ Unified Search (Busca em todos os campos)

3. **Filter Operations**
   - ✅ Filter by Type (Customer/Supplier)
   - ✅ Filter by Pessoa Juridica
   - ✅ Filter by Blacklist
   - ✅ Combined Filters (Múltiplos filtros)

4. **Test Scenarios**
   - ✅ Validation Tests (Campos obrigatórios, documentos duplicados)
   - ✅ Email Validation (Formato inválido)
   - ✅ Multiple Defaults (Múltiplos endereços/contatos padrão)
   - ✅ Search Validation (Queries vazias e muito curtas)
   - ✅ Pagination Validation (Páginas e limites inválidos)

#### 🚀 Como usar a Collection

1. **Importar no Postman:**
   - Abra o Postman
   - Clique em "Import"
   - Selecione o arquivo `postman-person-collection.json`

2. **Configurar variáveis:**
   - `baseUrl`: Configurada para `http://localhost:3000`
   - `personId`: Preenchida automaticamente ao criar pessoas

3. **Executar testes:**
   - Comece com "Create Person" para gerar dados
   - Use os endpoints de busca para testar funcionalidades
   - Execute os cenários de teste para validar comportamentos

#### 📝 Exemplos de Dados Incluídos

- **Cliente pessoa física** com endereço e contato completos
- **Fornecedor pessoa jurídica** com múltiplos contatos
- **Dados de teste** para validações e casos extremos
- **Busca com acentos** (URL encoded para "João")

### Status dos Testes

✅ **Todos os endpoints testados e funcionando**
✅ **Validações implementadas e testadas**
✅ **Buscas específicas e unificadas funcionando**
✅ **Filtros e paginação operacionais**
✅ **Soft delete implementado**
✅ **Collection Postman completa e funcional**

## 🔧 Configurações Técnicas Atualizadas

### Estrutura de Arquivos Completa

```text
src/person/
├── schemas/
│   ├── person.schema.ts
│   ├── address.schema.ts
│   ├── contact.schema.ts
│   └── models/
│       └── person.interface.ts
├── repositories/
│   ├── person.repository.ts
│   └── mongoose/
│       └── person.mongoose.repository.ts
├── utils/
│   ├── text-normalizer.ts
│   └── text-normalizer.example.ts
├── person.service.ts
├── person.controller.ts
├── person.module.ts
└── index.ts
```

### Arquivos de Documentação

```text
docs/api/
└── PERSON_MODULE.md (esta documentação)

postman-person-collection.json (collection do Postman)
```

### Dependências Utilizadas

- `@nestjs/mongoose`: Integração com MongoDB
- `mongoose`: ODM para MongoDB
- `class-validator`: Validação de DTOs
- `class-transformer`: Transformação de dados

### Configuração do Módulo Atualizada

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Person.name, schema: PersonSchema }]),
  ],
  controllers: [PersonController],
  providers: [
    PersonService,
    {
      provide: 'IPersonRepository',
      useClass: PersonMongooseRepository,
    },
  ],
  exports: [PersonService],
})
export class PersonModule {}
```

## 🎯 Casos de Uso Implementados

### 1. Cadastro Mínimo ✅

- Cliente pode ser cadastrado apenas com `name` e `pessoaJuridica`
- Outros campos podem ser preenchidos posteriormente

### 2. Cadastro Completo ✅

- Pessoa jurídica com todas as informações fiscais
- Múltiplos endereços e contatos
- Validações condicionais implementadas

### 3. Blacklist ✅

- Marcar clientes problemáticos
- Filtrar em relatórios e operações

### 4. Soft Delete ✅

- Preservar dados para auditoria
- Recuperar dados se necessário

### 5. Buscas Avançadas ✅

- Busca por nome (case-insensitive)
- Busca por documento (exata)
- Busca por razão social (case-insensitive)
- Busca por telefone (exata)
- Busca unificada em todos os campos

### 6. Filtros e Paginação ✅

- Filtros por tipo, pessoa jurídica, blacklist
- Paginação com controle de página e limite
- Validações de parâmetros

## 📝 Notas Importantes

1. **Flexibilidade**: O sistema permite cadastros graduais conforme necessário
2. **Performance**: Índices otimizados para as principais consultas
3. **Auditoria**: Soft delete preserva dados para histórico
4. **Escalabilidade**: Estrutura preparada para crescimento
5. **Manutenibilidade**: Código organizado e bem documentado
6. **Testabilidade**: Collection Postman completa para testes
7. **Validações**: Sistema robusto de validações de negócio
8. **Buscas**: Sistema de busca flexível e performático

## 🚀 Próximos Passos Sugeridos

Com o módulo Person 100% funcional, considere implementar:

1. **Módulo de Ordens de Serviço** - Para clientes
2. **Módulo de Pedidos de Compra** - Para fornecedores
3. **Módulo de Produtos/Serviços** - Catálogo
4. **Relatórios e Dashboard** - Análises e métricas
5. **Testes automatizados** - Unit tests e E2E tests
6. **Documentação Swagger** - API documentation automática

---

_Esta documentação foi atualizada em 19/01/2025 - Módulo Person 100% funcional e testado._
