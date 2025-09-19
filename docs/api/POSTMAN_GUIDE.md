# 📮 Guia da Collection Postman - Módulo Person

## 🎯 Visão Geral

Este guia explica como usar a collection do Postman para testar todos os endpoints do módulo Person. A collection está localizada em `postman-person-collection.json` na raiz do projeto.

## 📥 Importação da Collection

### 1. Importar no Postman

1. Abra o Postman
2. Clique em **"Import"** no canto superior esquerdo
3. Selecione o arquivo `postman-person-collection.json`
4. Clique em **"Import"**

### 2. Configurar Variáveis

A collection já vem com variáveis pré-configuradas:

- **`baseUrl`**: `http://localhost:3000` (configurável)
- **`personId`**: Preenchida automaticamente ao criar pessoas

Para alterar a URL base:

1. Clique no nome da collection
2. Vá para a aba **"Variables"**
3. Altere o valor de `baseUrl` se necessário

## 🚀 Como Usar a Collection

### Ordem Recomendada de Testes

1. **Criar dados de teste**
   - Execute "Create Person - Customer"
   - Execute "Create Person - Supplier"

2. **Testar operações CRUD**
   - "Get All Persons"
   - "Get Person by ID"
   - "Update Person"
   - "Delete Person"

3. **Testar buscas específicas**
   - "Search by Name"
   - "Search by Document"
   - "Search by Corporate Name"
   - "Search by Phone"

4. **Testar busca unificada**
   - "Unified Search"

5. **Testar filtros**
   - "Filter by Type - Customer"
   - "Filter by Type - Supplier"
   - "Filter by Pessoa Juridica"
   - "Combined Filters"

6. **Testar cenários de validação**
   - Execute todos os testes em "Test Scenarios"

## 📋 Detalhes dos Endpoints

### CRUD Operations

#### Create Person - Customer

- **Método**: POST
- **URL**: `{{baseUrl}}/persons`
- **Body**: Pessoa física com endereço e contato
- **Resultado**: Cria cliente e salva ID automaticamente

#### Create Person - Supplier

- **Método**: POST
- **URL**: `{{baseUrl}}/persons`
- **Body**: Pessoa jurídica com múltiplos contatos
- **Resultado**: Cria fornecedor

#### Get All Persons

- **Método**: GET
- **URL**: `{{baseUrl}}/persons`
- **Query**: Sem parâmetros
- **Resultado**: Lista todas as pessoas com paginação

#### Get All Persons - Paginated

- **Método**: GET
- **URL**: `{{baseUrl}}/persons?page=1&limit=5`
- **Query**: `page=1&limit=5`
- **Resultado**: Lista com paginação específica

#### Get Person by ID

- **Método**: GET
- **URL**: `{{baseUrl}}/persons/{{personId}}`
- **Resultado**: Busca pessoa específica

#### Update Person

- **Método**: PUT
- **URL**: `{{baseUrl}}/persons/{{personId}}`
- **Body**: Dados atualizados
- **Resultado**: Atualiza pessoa existente

#### Delete Person (Soft Delete)

- **Método**: DELETE
- **URL**: `{{baseUrl}}/persons/{{personId}}`
- **Resultado**: Marca como deletada (soft delete)

### Search Operations

#### Search by Name

- **Método**: GET
- **URL**: `{{baseUrl}}/persons/search/name?q=João`
- **Query**: `q=João`
- **Resultado**: Busca por nome (case-insensitive)

#### Search by Name - Accented

- **Método**: GET
- **URL**: `{{baseUrl}}/persons/search/name?q=Jo%C3%A3o`
- **Query**: `q=Jo%C3%A3o` (URL encoded)
- **Resultado**: Busca por nome com acentos

#### Search by Document

- **Método**: GET
- **URL**: `{{baseUrl}}/persons/search/document?q=123.456.789-00`
- **Query**: `q=123.456.789-00`
- **Resultado**: Busca por CPF/CNPJ (exata)

#### Search by Corporate Name

- **Método**: GET
- **URL**: `{{baseUrl}}/persons/search/corporate-name?q=ABC`
- **Query**: `q=ABC`
- **Resultado**: Busca por razão social (case-insensitive)

#### Search by Phone

- **Método**: GET
- **URL**: `{{baseUrl}}/persons/search/phone?q=99999-9999`
- **Query**: `q=99999-9999`
- **Resultado**: Busca por telefone (exata)

#### Unified Search

- **Método**: GET
- **URL**: `{{baseUrl}}/persons/search?q=João`
- **Query**: `q=João`
- **Resultado**: Busca em todos os campos de texto

#### Unified Search - Document

- **Método**: GET
- **URL**: `{{baseUrl}}/persons/search?q=12345678900`
- **Query**: `q=12345678900`
- **Resultado**: Busca por documento sem formatação

### Filter Operations

#### Filter by Type - Customer

- **Método**: GET
- **URL**: `{{baseUrl}}/persons?type=customer`
- **Query**: `type=customer`
- **Resultado**: Apenas clientes

#### Filter by Type - Supplier

- **Método**: GET
- **URL**: `{{baseUrl}}/persons?type=supplier`
- **Query**: `type=supplier`
- **Resultado**: Apenas fornecedores

#### Filter by Pessoa Juridica

- **Método**: GET
- **URL**: `{{baseUrl}}/persons?pessoaJuridica=true`
- **Query**: `pessoaJuridica=true`
- **Resultado**: Apenas pessoas jurídicas

#### Filter by Blacklist

- **Método**: GET
- **URL**: `{{baseUrl}}/persons?blacklist=false`
- **Query**: `blacklist=false`
- **Resultado**: Pessoas não bloqueadas

#### Combined Filters

- **Método**: GET
- **URL**: `{{baseUrl}}/persons?type=customer&pessoaJuridica=false&blacklist=false&page=1&limit=10`
- **Query**: Múltiplos filtros + paginação
- **Resultado**: Filtros combinados

### Test Scenarios

#### Validation Tests

**Test Validation - Missing Required Fields**

- **Método**: POST
- **Body**: Apenas `type: "customer"`
- **Resultado**: Erro 400 - Campos obrigatórios ausentes

**Test Validation - Duplicate Document**

- **Método**: POST
- **Body**: Documento já existente
- **Resultado**: Erro 409 - Documento duplicado

**Test Validation - Invalid Email**

- **Método**: POST
- **Body**: Email com formato inválido
- **Resultado**: Erro 400 - Email inválido

**Test Validation - Multiple Default Addresses**

- **Método**: POST
- **Body**: Múltiplos endereços com `isDefault: true`
- **Resultado**: Erro 400 - Apenas um endereço padrão

#### Search Validation Tests

**Test Search - Empty Query**

- **Método**: GET
- **Query**: `q=` (vazio)
- **Resultado**: Erro 400 - Query muito curta

**Test Search - Short Query**

- **Método**: GET
- **Query**: `q=a` (1 caractere)
- **Resultado**: Erro 400 - Query muito curta

#### Pagination Validation Tests

**Test Pagination - Invalid Page**

- **Método**: GET
- **Query**: `page=0`
- **Resultado**: Erro 400 - Página inválida

**Test Pagination - Invalid Limit**

- **Método**: GET
- **Query**: `limit=200`
- **Resultado**: Erro 400 - Limite inválido

## 🔧 Scripts Automáticos

### Pré-request Script

Executado antes de cada request:

```javascript
// Script executado antes de cada request
console.log('Executando request para:', pm.request.url);
```

### Test Script

Executado após cada request:

```javascript
// Script executado após cada request
console.log('Response status:', pm.response.status);

// Salva o ID da pessoa criada para uso posterior
if (pm.response.status === 201 && pm.response.json().id) {
  pm.collectionVariables.set('personId', pm.response.json().id);
  console.log('Person ID salvo:', pm.response.json().id);
}
```

## 📊 Exemplos de Dados

### Cliente Pessoa Física

```json
{
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
}
```

### Fornecedor Pessoa Jurídica

```json
{
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
    },
    {
      "name": "Pedro Costa",
      "phone": "(11) 77777-7777",
      "email": "pedro@abcfornecedor.com",
      "sector": "Financeiro",
      "isWhatsApp": true,
      "isDefault": false
    }
  ]
}
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro 400 - Campos obrigatórios**
   - Verifique se `name` e `pessoaJuridica` estão preenchidos

2. **Erro 409 - Documento duplicado**
   - Use um documento diferente ou delete a pessoa existente

3. **Erro 400 - Email inválido**
   - Verifique o formato do email (deve ter @ e domínio)

4. **Erro 400 - Múltiplos padrões**
   - Apenas um endereço/contato pode ter `isDefault: true`

5. **Busca com acentos não funciona**
   - Use URL encoding: `Jo%C3%A3o` em vez de `João`

6. **Variável personId não está sendo salva**
   - Execute primeiro um "Create Person" com sucesso

### Dicas de Uso

1. **Execute em ordem**: Comece sempre criando dados antes de testar buscas
2. **Use variáveis**: A `personId` é salva automaticamente para facilitar testes
3. **Teste validações**: Execute os "Test Scenarios" para verificar comportamentos
4. **Monitore logs**: Use o console do Postman para ver logs dos scripts
5. **Backup de dados**: Crie dados de teste antes de executar testes destrutivos

## 📝 Notas Importantes

- A collection está configurada para `localhost:3000`
- Todos os endpoints requerem autenticação (JWT)
- Soft delete preserva dados para auditoria
- Buscas são case-insensitive para nomes e razão social
- Documentos devem ser únicos quando preenchidos
- Apenas um endereço/contato pode ser padrão por pessoa

---

_Esta documentação foi criada em 19/01/2025 - Collection Postman completa e testada._
