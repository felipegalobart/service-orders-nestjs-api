# ⚙️ Configuração do Projeto

Esta seção contém toda a documentação relacionada à configuração e setup do projeto Service Orders NestJS API.

## 📋 Documentos Disponíveis

### **Configuração e Setup**

- **[Configuração](./CONFIG.md)** - Guia completo de configuração de variáveis de ambiente
- **[Prettier Setup](./PRETTIER_SETUP.md)** - Configuração de formatação automática de código

## 🚀 **Quick Start para Configuração**

### **1. Configuração Inicial**

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# 3. Verificar configuração
npm run lint:check
npm run format:check
```

### **2. Configuração de Desenvolvimento**

```bash
# Instalar dependências de teste
npm install --save-dev mongodb-memory-server

# Executar testes para validar
npm run test:unit
```

## 🔧 **Ferramentas Configuradas**

### **Qualidade de Código**

- ✅ **ESLint** - Linting automático
- ✅ **Prettier** - Formatação automática
- ✅ **TypeScript** - Tipagem estática

### **Testes**

- ✅ **Jest** - Framework de testes
- ✅ **MongoDB Memory Server** - Banco de testes
- ✅ **Supertest** - Testes de API

### **Desenvolvimento**

- ✅ **NestJS CLI** - Framework
- ✅ **Mongoose** - ODM para MongoDB
- ✅ **JWT** - Autenticação

## 📊 **Variáveis de Ambiente**

### **Obrigatórias**

- `MONGODB_URI` - URI de conexão com MongoDB
- `JWT_SECRET` - Chave secreta para JWT

### **Opcionais**

- `PORT` - Porta do servidor (padrão: 3000)
- `NODE_ENV` - Ambiente (development/production)
- `JWT_EXPIRES_IN` - Expiração do JWT (padrão: 7d)

## 🎯 **Próximos Passos**

1. **Leia a [Configuração](./CONFIG.md)** para setup completo
2. **Configure o [Prettier](./PRETTIER_SETUP.md)** para formatação automática
3. **Execute `npm run start:dev`** para iniciar o desenvolvimento
4. **Valide com `npm run test:unit`**

---

**📚 Para mais informações, consulte a [Documentação Principal](../README.md)**
