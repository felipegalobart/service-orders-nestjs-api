# 📋 Módulo Person - Documentação da API

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

```
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
- Campos obrigatórios: `name`, `type`, `pessoaJuridica`, `blacklist`, `isActive`

### Validações de Endereço

- Todos os campos são opcionais
- Apenas um endereço pode ser `isDefault = true`
- `isDefault` tem valor padrão `true`

### Validações de Contato

- Todos os campos são opcionais
- Apenas um contato pode ser `isDefault = true`
- `isDefault` tem valor padrão `true`

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

```
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

## 📝 Notas Importantes

1. **Flexibilidade**: O sistema permite cadastros graduais conforme necessário
2. **Performance**: Índices otimizados para as principais consultas
3. **Auditoria**: Soft delete preserva dados para histórico
4. **Escalabilidade**: Estrutura preparada para crescimento
5. **Manutenibilidade**: Código organizado e bem documentado

---

_Esta documentação será atualizada conforme o desenvolvimento do módulo._
