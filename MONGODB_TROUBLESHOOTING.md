# 🔐 Guia de Resolução - Problemas de Autenticação MongoDB

## 🚨 Problemas Comuns e Soluções

### **1. 🔍 Diagnóstico do Problema**

#### **Verificar Status do MongoDB:**

```bash
# Verificar se o MongoDB está rodando
brew services list | grep mongodb
# ou
ps aux | grep mongodb
```

#### **Testar Conexão Direta:**

```bash
# Conectar diretamente ao MongoDB
mongosh "mongodb://192.168.31.75:27017/stock-management"
```

#### **Verificar Logs do NestJS:**

```bash
# Verificar logs de erro
npm run start:dev
# Procurar por erros de conexão MongoDB
```

---

## 🛠️ Soluções por Tipo de Problema

### **A. 🚫 MongoDB não está rodando**

#### **Solução 1: Iniciar MongoDB local**

```bash
# Usando Homebrew
brew services start mongodb-community

# Ou manualmente
mongod --config /usr/local/etc/mongod.conf
```

#### **Solução 2: Usar MongoDB Atlas (Cloud)**

```bash
# Atualizar .env com string de conexão do Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stock-management?retryWrites=true&w=majority
```

### **B. 🔐 Problemas de Autenticação**

#### **Solução 1: MongoDB sem autenticação (Desenvolvimento)**

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/stock-management
```

#### **Solução 2: MongoDB com usuário e senha**

```bash
# .env
MONGODB_URI=mongodb://username:password@localhost:27017/stock-management
```

#### **Solução 3: MongoDB com autenticação e database específico**

```bash
# .env
MONGODB_URI=mongodb://username:password@localhost:27017/stock-management?authSource=admin
```

### **C. 🌐 Problemas de Rede**

#### **Solução 1: IP incorreto**

```bash
# Verificar IP correto do MongoDB
ifconfig | grep "inet "
# Atualizar .env com IP correto
MONGODB_URI=mongodb://192.168.1.100:27017/stock-management
```

#### **Solução 2: Porta incorreta**

```bash
# Verificar porta do MongoDB
netstat -an | grep 27017
# Padrão: 27017
```

#### **Solução 3: Firewall bloqueando**

```bash
# macOS - Permitir conexão
sudo pfctl -f /etc/pf.conf
```

---

## 🔧 Configurações Recomendadas

### **1. 🏠 Desenvolvimento Local**

#### **Arquivo .env:**

```bash
# MongoDB Local (sem autenticação)
MONGODB_URI=mongodb://localhost:27017/stock-management

# MongoDB Local (com autenticação)
MONGODB_URI=mongodb://admin:password@localhost:27017/stock-management?authSource=admin
```

#### **Criar usuário MongoDB:**

```javascript
// Conectar ao MongoDB
mongosh

// Criar usuário administrador
use admin
db.createUser({
  user: "admin",
  pwd: "password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

// Criar usuário para o banco específico
use stock-management
db.createUser({
  user: "stockuser",
  pwd: "stockpass",
  roles: ["readWrite"]
})
```

### **2. ☁️ Produção (MongoDB Atlas)**

#### **Arquivo .env:**

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/stock-management?retryWrites=true&w=majority
```

#### **Configurar Atlas:**

1. Criar cluster no MongoDB Atlas
2. Configurar usuário de banco de dados
3. Configurar IP whitelist
4. Obter string de conexão

### **3. 🐳 Docker**

#### **docker-compose.yml:**

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    container_name: stock-mongodb
    restart: always
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: stock-management
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

#### **Arquivo .env:**

```bash
MONGODB_URI=mongodb://admin:password@localhost:27017/stock-management?authSource=admin
```

---

## 🧪 Testes de Conexão

### **1. 🔍 Teste Manual**

#### **Conectar via mongosh:**

```bash
# Sem autenticação
mongosh "mongodb://localhost:27017/stock-management"

# Com autenticação
mongosh "mongodb://username:password@localhost:27017/stock-management"
```

#### **Testar operações:**

```javascript
// Listar bancos
show dbs

// Usar banco
use stock-management

// Criar coleção de teste
db.products.insertOne({name: "Test", quantity: 10, relationalId: 1})

// Listar documentos
db.products.find()
```

### **2. 🚀 Teste via API**

#### **Endpoint de teste:**

```typescript
// Adicionar ao StockController
@Get('test-connection')
async testConnection() {
  try {
    // Testar conexão com uma operação simples
    const count = await this.stockService.getStockCount();
    return {
      status: 'success',
      message: 'MongoDB connection working',
      count
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'MongoDB connection failed',
      error: error.message
    };
  }
}
```

---

## 🚨 Erros Comuns e Soluções

### **1. "MongoNetworkError: failed to connect"**

```bash
# Solução: Verificar se MongoDB está rodando
brew services start mongodb-community
```

### **2. "MongoServerError: Authentication failed"**

```bash
# Solução: Verificar credenciais
MONGODB_URI=mongodb://username:password@localhost:27017/stock-management
```

### **3. "MongoServerError: not authorized"**

```bash
# Solução: Verificar permissões do usuário
# Conectar como admin e dar permissões
```

### **4. "MongoNetworkError: connection timeout"**

```bash
# Solução: Verificar IP e porta
# Testar conectividade de rede
ping 192.168.31.75
```

---

## 📋 Checklist de Resolução

### **✅ Verificações Básicas:**

- [ ] MongoDB está rodando?
- [ ] IP e porta estão corretos?
- [ ] Credenciais estão corretas?
- [ ] Firewall não está bloqueando?
- [ ] String de conexão está formatada corretamente?

### **✅ Testes:**

- [ ] Conectar via mongosh
- [ ] Testar operações básicas
- [ ] Verificar logs do NestJS
- [ ] Testar endpoint da API

### **✅ Configuração:**

- [ ] Arquivo .env configurado
- [ ] Usuário MongoDB criado
- [ ] Permissões configuradas
- [ ] Rede configurada

---

## 🆘 Suporte Adicional

### **📚 Recursos Úteis:**

- **MongoDB Documentation**: <https://docs.mongodb.com/>
- **NestJS MongoDB**: <https://docs.nestjs.com/techniques/mongodb>
- **MongoDB Atlas**: <https://www.mongodb.com/atlas>

### **🔧 Comandos de Diagnóstico:**

```bash
# Verificar status do MongoDB
brew services list | grep mongodb

# Verificar processos MongoDB
ps aux | grep mongodb

# Testar conectividade
telnet 192.168.31.75 27017

# Verificar logs do sistema
tail -f /usr/local/var/log/mongodb/mongo.log
```

---

**💡 Dica:** Para desenvolvimento, recomendo usar MongoDB local sem autenticação para simplicidade. Para produção, sempre use autenticação e MongoDB Atlas.
