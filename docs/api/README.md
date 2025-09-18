# 📡 Documentação da API

Esta seção contém toda a documentação relacionada ao uso e teste da API Service Orders NestJS.

## 📋 Documentos Disponíveis

### **Guias de Uso**

- **[Guia do Postman](./POSTMAN_GUIDE.md)** - Como testar a API usando Postman

## 🚀 **Quick Start para API**

### **1. Iniciar a API**

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

### **2. Testar a API**

```bash
# Health check
curl http://localhost:3000/

# Usar Postman (recomendado)
# Importar: postman-collection.json
```

## 🔗 **Endpoints Disponíveis**

### **Autenticação (Públicos)**

- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário

### **Usuários (Protegidos)**

- `GET /users/profile` - Perfil do usuário atual
- `GET /users/:id` - Buscar usuário por ID (Admin)
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário (Admin)
- `GET /users` - Listar todos os usuários (Admin)

## 🛡️ **Autenticação e Autorização**

### **JWT Authentication**

- Tokens JWT com expiração configurável
- Headers: `Authorization: Bearer <token>`

### **Sistema de Roles**

- **USER** - Usuário padrão
- **ADMIN** - Administrador
- **MODERATOR** - Moderador

### **Rate Limiting**

- Autenticação: 5 req/min
- Públicos: 20 req/min
- Usuário: 10 req/min
- Admin: 3 req/min

## 📊 **Modelo de Dados**

### **Usuário**

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
}
```

## 🧪 **Testando a API**

### **Com Postman**

1. Importe `postman-collection.json`
2. Configure a variável `{{baseUrl}}`
3. Execute os testes da coleção

### **Com cURL**

```bash
# Registrar usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🎯 **Próximos Passos**

1. **Leia o [Guia do Postman](./POSTMAN_GUIDE.md)** para testes detalhados
2. **Importe a coleção** `postman-collection.json`
3. **Configure as variáveis** de ambiente no Postman
4. **Execute os testes** para validar a API

---

**📚 Para mais informações, consulte a [Documentação Principal](../README.md)**
