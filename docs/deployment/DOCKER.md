# 🐳 Docker & Containerização

Guia completo para containerização e deployment da Service Orders API usando Docker.

## 📋 Índice

- [🐳 Docker Setup](#-docker-setup)
- [🏗️ Estrutura Docker](#️-estrutura-docker)
- [⚙️ Configuração](#️-configuração)
- [🚀 Deployment](#-deployment)
- [🔧 Troubleshooting](#-troubleshooting)
- [📊 Monitoramento](#-monitoramento)

## 🐳 Docker Setup

### Arquivos Docker

| Arquivo                | Descrição                       |
| ---------------------- | ------------------------------- |
| `Dockerfile`           | Imagem da aplicação NestJS      |
| `docker-compose.yml`   | Orquestração de serviços        |
| `.dockerignore`        | Arquivos ignorados no build     |
| `docker/nginx.conf`    | Configuração do Nginx           |
| `docker/mongo-init.js` | Script de inicialização MongoDB |

### Serviços Configurados

```yaml
services:
  app: # Aplicação NestJS
  redis: # Cache e rate limiting
  nginx: # Reverse proxy
```

## 🏗️ Estrutura Docker

### Dockerfile

```dockerfile
# Multi-stage build otimizado
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
USER nestjs
CMD ["node", "dist/src/main.js"]
```

### Docker Compose

```yaml
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    env_file:
      - .env.production
    depends_on:
      - redis
    networks:
      - service-orders-network

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    env_file:
      - .env.production
    networks:
      - service-orders-network

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
    volumes:
      - ./docker/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    networks:
      - service-orders-network
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie o arquivo `.env.production`:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://username:password@192.168.1.100:27017/service-orders

# Application
NODE_ENV=production
PORT=3000

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here-example
JWT_EXPIRES_IN=7d

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Redis
REDIS_PASSWORD=your-redis-password-example

# Security
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=http://192.168.1.100:80

# Logging
LOG_LEVEL=info
```

### Configuração Nginx

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## 🚀 Deployment

### Script Automatizado

Use o script `deploy-homelab.sh`:

```bash
#!/bin/bash
echo "🚀 Service Orders API - Homelab Deployment"
echo "================================================"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado"
    exit 1
fi

# Verificar Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose não está disponível"
    exit 1
fi

# Verificar arquivo de ambiente
if [ ! -f ".env.production" ]; then
    echo "❌ Arquivo .env.production não encontrado"
    exit 1
fi

echo "✅ Docker e Docker Compose estão instalados"
echo "✅ Arquivo de ambiente está configurado"

# Parar containers existentes
echo "🛑 Parando containers existentes..."
$COMPOSE_CMD down

# Remover imagens antigas
echo "🗑️ Removendo imagens antigas..."
docker image prune -f

# Build e start
echo "🔨 Construindo e iniciando serviços..."
$COMPOSE_CMD up --build -d

# Verificar saúde
echo "🏥 Verificando saúde dos serviços..."
sleep 10

if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ API está funcionando"
else
    echo "❌ API health check falhou"
    echo "📋 Verificando logs..."
    $COMPOSE_CMD logs app
    exit 1
fi

echo "🎉 Deploy concluído com sucesso!"
echo "🌐 API disponível em: http://192.168.1.100:3000"
echo "🌐 Nginx disponível em: http://192.168.1.100:80"
```

### Comandos Manuais

```bash
# Build da imagem
docker build -t service-orders-api .

# Executar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild completo
docker-compose down
docker-compose up --build -d
```

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Porta 443 já em uso

```bash
# Erro: failed to bind host port for 0.0.0.0:443
# Solução: Remover porta 443 do docker-compose.yml
```

#### 2. MongoDB não conecta

```bash
# Verificar conectividade
nc -z 192.168.1.100 27017

# Verificar credenciais
mongosh "mongodb://username:password@192.168.1.100:27017/service-orders?authSource=admin"
```

#### 3. main.js não encontrado

```bash
# Erro: Cannot find module '/app/dist/main.js'
# Solução: Corrigir CMD no Dockerfile para "dist/src/main.js"
```

#### 4. Variáveis de ambiente não carregadas

```bash
# Verificar se .env.production existe
ls -la .env.production

# Verificar permissões
chmod 644 .env.production
```

### Comandos de Debug

```bash
# Entrar no container
docker exec -it service-orders-api sh

# Ver logs específicos
docker-compose logs app
docker-compose logs redis
docker-compose logs nginx

# Verificar variáveis de ambiente
docker exec service-orders-api env

# Testar conectividade interna
docker exec service-orders-api ping redis
docker exec service-orders-api ping nginx
```

## 📊 Monitoramento

### Health Checks

```bash
# API Health
curl http://192.168.1.100:3000/health

# Via Nginx
curl http://192.168.1.100:80/health

# Status dos containers
docker-compose ps
```

### Métricas

```bash
# Uso de recursos
docker stats

# Logs em tempo real
docker-compose logs -f --tail=100

# Espaço em disco
docker system df
```

### Testes de Funcionalidade

```bash
# Criar usuário admin
curl -X POST http://192.168.1.100:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123","name":"Admin","role":"admin"}'

# Login
curl -X POST http://192.168.1.100:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Testar endpoint protegido
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://192.168.1.100:3000/users/profile
```

## 🔄 Atualizações

### Deploy de Nova Versão

```bash
# 1. Fazer backup
docker-compose down
docker save service-orders-api > backup.tar

# 2. Atualizar código
git pull origin main

# 3. Rebuild e deploy
./deploy-homelab.sh

# 4. Verificar funcionamento
curl http://192.168.1.100:3000/health
```

### Rollback

```bash
# Restaurar backup
docker load < backup.tar
docker-compose up -d
```

## 📋 Checklist de Deployment

- [ ] Docker e Docker Compose instalados
- [ ] Arquivo `.env.production` configurado
- [ ] MongoDB externo acessível
- [ ] Portas 3000 e 80 disponíveis
- [ ] Script `deploy-homelab.sh` executável
- [ ] Testes de conectividade passando
- [ ] Health checks funcionando
- [ ] Autenticação JWT funcionando
- [ ] Rate limiting funcionando
- [ ] Nginx proxy funcionando
- [ ] Logs sendo gerados corretamente
- [ ] Backup configurado

---

## 🎯 Status Atual

- ✅ **Docker**: Configurado e funcionando
- ✅ **MongoDB**: Conectado externamente
- ✅ **Redis**: Containerizado e funcionando
- ✅ **Nginx**: Reverse proxy funcionando
- ✅ **API**: Funcionando na porta 3000
- ✅ **Proxy**: Funcionando na porta 80
- ✅ **Autenticação**: JWT funcionando
- ✅ **Roles**: Sistema de permissões funcionando
- ✅ **Rate Limiting**: Funcionando
- ✅ **Health Checks**: Implementados

**🎉 Sistema totalmente containerizado e funcionando no homelab!**
