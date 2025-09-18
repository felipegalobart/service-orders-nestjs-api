# 🚀 Coleção Postman - User Management API

Este arquivo contém uma coleção completa do Postman para testar todos os endpoints da API de gerenciamento de usuários e autenticação.

## 📥 Como Importar

1. **Abrir Postman**
2. **Clicar em "Import"**
3. **Selecionar o arquivo** `postman-collection.json`
4. **Confirmar a importação**

## 🔧 Configuração

### **Variáveis de Ambiente**

A coleção usa as seguintes variáveis:

- `{{baseUrl}}` - URL base da API (padrão: `http://localhost:3000`)
- `{{userId}}` - ID do usuário (preenchido automaticamente)
- `{{accessToken}}` - Token JWT (preenchido automaticamente)

### **Configurar URL Base**

1. **Abrir a coleção**
2. **Clicar em "Variables"**
3. **Alterar `baseUrl`** para sua URL (ex: `http://localhost:3000`)

## 📋 Endpoints Disponíveis

### **🏠 Health Check**

- ✅ **Health Check** - Verificar se a API está funcionando

### **🔐 Authentication**

- ✅ **Register User** - Registrar novo usuário
- ✅ **Login User** - Fazer login
- ✅ **Register Admin** - Exemplo de registro de admin
- ✅ **Login Admin** - Exemplo de login de admin

### **👥 User Management**

- ✅ **Get User by ID** - Buscar usuário específico
- ✅ **Update User** - Atualizar dados do usuário
- ✅ **Delete User** - Remover usuário

### **🧪 Testes de Erro**

- ✅ **Register Duplicate Email** - Testar email duplicado
- ✅ **Login Invalid Credentials** - Testar credenciais inválidas
- ✅ **Get User Without Token** - Testar acesso sem autenticação
- ✅ **Get Non-existent User** - Testar usuário não encontrado

### **✅ Testes de Validação**

- ✅ **Register Missing Fields** - Testar campos obrigatórios
- ✅ **Invalid Email Format** - Testar formato de email
- ✅ **Short Password** - Testar senha muito curta

## 🚀 Como Usar

### **1. Teste Básico**

1. **Execute `Health Check`** para verificar se a API está funcionando
2. **Execute `Register User`** para criar um usuário
3. **Execute `Login User`** para fazer login
4. **Execute `Get User by ID`** para buscar o usuário

### **2. Fluxo Completo**

1. **Registrar usuário** com `Register User`
2. **Fazer login** com `Login User`
3. **Buscar usuário** com `Get User by ID`
4. **Atualizar dados** com `Update User`
5. **Deletar usuário** com `Delete User`

### **3. Testes de Validação**

1. **Execute `Register Missing Fields`** para testar validação
2. **Execute `Invalid Email Format`** para testar formato de email
3. **Execute `Short Password`** para testar validação de senha

## 🔄 Scripts Automáticos

A coleção inclui scripts que executam automaticamente:

### **Pré-requisição**

- Log da URL sendo executada

### **Pós-requisição**

- **Salva automaticamente** o ID do usuário criado
- **Salva automaticamente** o token JWT após login
- **Testa** status code de sucesso
- **Testa** tempo de resposta < 5000ms

## 📊 Exemplos de Resposta

### **Registro de Usuário**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68cb3e5ff3a1b5397d4cbc49",
    "email": "test@example.com",
    "name": "Test User",
    "createdAt": "2025-01-18T15:30:00.000Z",
    "updatedAt": "2025-01-18T15:30:00.000Z"
  }
}
```

### **Login de Usuário**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "68cb3e5ff3a1b5397d4cbc49",
    "email": "test@example.com",
    "name": "Test User",
    "createdAt": "2025-01-18T15:30:00.000Z",
    "updatedAt": "2025-01-18T15:30:00.000Z"
  }
}
```

## ⚠️ Códigos de Erro

| Código | Descrição                |
| ------ | ------------------------ |
| `200`  | Sucesso                  |
| `201`  | Criado com sucesso       |
| `400`  | Dados inválidos          |
| `401`  | Não autorizado           |
| `404`  | Usuário não encontrado   |
| `500`  | Erro interno do servidor |

## 🔧 Troubleshooting

### **Problema: Token não é salvo automaticamente**

- **Solução**: Verifique se o login retornou status 200
- **Verificar**: Console do Postman para logs

### **Problema: Usuário não é encontrado**

- **Solução**: Execute primeiro `Register User`
- **Verificar**: Se o `userId` foi salvo nas variáveis

### **Problema: Erro de conexão**

- **Solução**: Verifique se a API está rodando
- **Verificar**: URL base nas variáveis da coleção

## 📝 Notas Importantes

- **Autenticação**: Alguns endpoints requerem token JWT
- **Validação**: Todos os dados são validados com Zod
- **Scripts**: Executam automaticamente em cada requisição
- **Variáveis**: São preenchidas automaticamente pelos scripts

---

**Desenvolvido com ❤️ para facilitar os testes da API**
