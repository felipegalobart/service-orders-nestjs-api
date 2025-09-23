# 🏠 Homelab Deployment

Guia específico para deployment da Service Orders API no ambiente homelab.

## 📋 Índice

- [🏠 Configuração Homelab](#-configuração-homelab)
- [🌐 Rede e Conectividade](#-rede-e-conectividade)
- [🗄️ Banco de Dados](#️-banco-de-dados)
- [🚀 Deploy Automatizado](#-deploy-automatizado)
- [🔧 Configurações Específicas](#-configurações-específicas)
- [📊 Monitoramento](#-monitoramento)

## 🏠 Configuração Homelab

### Especificações do Ambiente

- **IP**: `192.168.31.75`
- **OS**: Linux (Ubuntu/Debian)
- **Docker**: Instalado e configurado
- **MongoDB**: Instância externa existente
- **Rede**: Rede local 192.168.31.0/24

### Serviços Configurados

| Serviço     | Porta | Status | Descrição        |
| ----------- | ----- | ------ | ---------------- |
| **API**     | 3000  | ✅     | Aplicação NestJS |
| **Nginx**   | 80    | ✅     | Reverse proxy    |
| **Redis**   | 6379  | ✅     | Cache interno    |
| **MongoDB** | 27017 | ✅     | Banco externo    |

## 🌐 Rede e Conectividade

### Configuração de Rede

```bash
# Verificar conectividade
ping 192.168.31.75

# Testar portas
nc -z 192.168.31.75 3000  # API
nc -z 192.168.31.75 80    # Nginx
nc -z 192.168.31.75 27017 # MongoDB
```

### Firewall

```bash
# Permitir portas necessárias
sudo ufw allow 3000
sudo ufw allow 80
sudo ufw allow 27017
sudo ufw reload
```

### DNS Local (Opcional)

```bash
# Adicionar ao /etc/hosts
echo "192.168.31.75 api.homelab.local" >> /etc/hosts
echo "192.168.31.75 service-orders.homelab.local" >> /etc/hosts
```

## 🗄️ Banco de Dados

### MongoDB Externo

**Configuração Atual:**

- **Host**: `192.168.31.75:27017`
- **Database**: `service-orders`
- **Usuário**: `serviceuser`
- **Senha**: `servicepass`
- **Auth Source**: `admin`

### String de Conexão

```bash
MONGODB_URI=mongodb://serviceuser:servicepass@192.168.31.75:27017/service-orders?authSource=admin
```

### Teste de Conectividade

```bash
# Testar conexão MongoDB
mongosh "mongodb://serviceuser:servicepass@192.168.31.75:27017/service-orders?authSource=admin"

# Verificar databases
show dbs

# Verificar collections
use service-orders
show collections
```

### Backup do MongoDB

```bash
# Backup completo
mongodump --uri="mongodb://serviceuser:servicepass@192.168.31.75:27017/service-orders?authSource=admin" --out=./backup

# Restore
mongorestore --uri="mongodb://serviceuser:servicepass@192.168.31.75:27017/service-orders?authSource=admin" ./backup/service-orders
```

## 🚀 Deploy Automatizado

### Script de Deploy

O script `deploy-homelab.sh` automatiza todo o processo:

```bash
#!/bin/bash
echo "🚀 Service Orders API - Homelab Deployment"
echo "================================================"

# Verificações pré-deploy
check_docker() {
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker não está instalado"
        exit 1
    fi
    echo "✅ Docker está instalado"
}

check_compose() {
    if command -v docker-compose &> /dev/null; then
        COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        echo "❌ Docker Compose não está disponível"
        exit 1
    fi
    echo "✅ Docker Compose está disponível"
}

check_env() {
    if [ ! -f ".env.production" ]; then
        echo "❌ Arquivo .env.production não encontrado"
        exit 1
    fi
    echo "✅ Arquivo de ambiente está configurado"
}

# Executar verificações
check_docker
check_compose
check_env

# Deploy
echo "🛑 Parando containers existentes..."
$COMPOSE_CMD down

echo "🗑️ Removendo imagens antigas..."
docker image prune -f

echo "🔨 Construindo e iniciando serviços..."
$COMPOSE_CMD up --build -d

# Health check
echo "🏥 Verificando saúde dos serviços..."
sleep 10

if curl -f http://192.168.31.75:3000/health > /dev/null 2>&1; then
    echo "✅ API está funcionando"
    echo "🎉 Deploy concluído com sucesso!"
    echo "🌐 API: http://192.168.31.75:3000"
    echo "🌐 Nginx: http://192.168.31.75:80"
else
    echo "❌ API health check falhou"
    echo "📋 Verificando logs..."
    $COMPOSE_CMD logs app
    exit 1
fi
```

### Execução

```bash
# Tornar executável
chmod +x deploy-homelab.sh

# Executar deploy
./deploy-homelab.sh
```

## 🔧 Configurações Específicas

### Arquivo .env.production

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://serviceuser:servicepass@192.168.31.75:27017/service-orders?authSource=admin

# Application
NODE_ENV=production
PORT=3000

# JWT Authentication
JWT_SECRET=1ddd030021d4e498fe25a4f51df4089ec54d5b9c04fe1c44297a3b206a3acc83a3b758f6366629b87429111e8013c474c5998364e4d8afd6d4b247cea0b70ea2
JWT_EXPIRES_IN=7d

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Redis
REDIS_PASSWORD=Mitsuwa1478!

# Security
BCRYPT_ROUNDS=12

# CORS
CORS_ORIGIN=http://192.168.31.75:80

# Logging
LOG_LEVEL=info
```

### Docker Compose Homelab

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
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    env_file:
      - .env.production
    depends_on:
      - redis
    networks:
      - service-orders-network
    restart: unless-stopped

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
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}

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
    restart: unless-stopped

networks:
  service-orders-network:
    driver: bridge
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
        server_name 192.168.31.75;

        # Logs
        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        # Proxy para API
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check específico
        location /health {
            proxy_pass http://app/health;
            access_log off;
        }
    }
}
```

## 📊 Monitoramento

### Health Checks

```bash
# Script de monitoramento
#!/bin/bash
echo "🔍 Verificando saúde dos serviços..."

# API Health
if curl -f http://192.168.31.75:3000/health > /dev/null 2>&1; then
    echo "✅ API: Funcionando"
else
    echo "❌ API: Falha"
fi

# Nginx Health
if curl -f http://192.168.31.75:80/health > /dev/null 2>&1; then
    echo "✅ Nginx: Funcionando"
else
    echo "❌ Nginx: Falha"
fi

# MongoDB Health
if nc -z 192.168.31.75 27017; then
    echo "✅ MongoDB: Conectado"
else
    echo "❌ MongoDB: Desconectado"
fi

# Redis Health
if docker exec service-orders-redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: Funcionando"
else
    echo "❌ Redis: Falha"
fi
```

### Logs

```bash
# Ver logs em tempo real
docker-compose logs -f

# Logs específicos
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f redis

# Logs com timestamp
docker-compose logs -f --timestamps
```

### Métricas

```bash
# Uso de recursos
docker stats

# Espaço em disco
docker system df

# Containers rodando
docker-compose ps

# Status detalhado
docker-compose ps -a
```

## 🧪 Testes de Funcionalidade

### Teste Completo

```bash
#!/bin/bash
echo "🧪 Testando funcionalidades da API..."

# 1. Health Check
echo "1. Health Check:"
curl -s http://192.168.31.75:3000/health | jq

# 2. Criar usuário admin
echo "2. Criando usuário admin:"
ADMIN_RESPONSE=$(curl -s -X POST http://192.168.31.75:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@homelab.com","password":"admin123","name":"Admin","role":"admin"}')

echo $ADMIN_RESPONSE | jq

# 3. Login
echo "3. Fazendo login:"
LOGIN_RESPONSE=$(curl -s -X POST http://192.168.31.75:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@homelab.com","password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')
echo "Token: $TOKEN"

# 4. Testar endpoint protegido
echo "4. Testando endpoint protegido:"
curl -s -H "Authorization: Bearer $TOKEN" \
  http://192.168.31.75:3000/users/profile | jq

# 5. Listar usuários (admin)
echo "5. Listando usuários:"
curl -s -H "Authorization: Bearer $TOKEN" \
  http://192.168.31.75:3000/users | jq '. | length'

echo "✅ Testes concluídos!"
```

### Teste via Nginx

```bash
# Testar através do proxy
curl http://192.168.31.75:80/health
curl http://192.168.31.75:80/users/profile
```

## 🔄 Manutenção

### Atualizações

```bash
# 1. Backup
docker-compose down
docker save service-orders-api > backup-$(date +%Y%m%d).tar

# 2. Atualizar código
git pull origin main

# 3. Rebuild
./deploy-homelab.sh

# 4. Verificar
curl http://192.168.31.75:3000/health
```

### Limpeza

```bash
# Limpar containers parados
docker container prune -f

# Limpar imagens não utilizadas
docker image prune -f

# Limpar volumes não utilizados
docker volume prune -f

# Limpeza completa
docker system prune -f
```

## 📋 Checklist Homelab

### Pré-Deploy

- [ ] Docker instalado e funcionando
- [ ] Docker Compose disponível
- [ ] MongoDB externo acessível
- [ ] Portas 3000 e 80 disponíveis
- [ ] Arquivo `.env.production` configurado
- [ ] Script `deploy-homelab.sh` executável

### Pós-Deploy

- [ ] API respondendo na porta 3000
- [ ] Nginx proxy funcionando na porta 80
- [ ] MongoDB conectado e funcionando
- [ ] Redis funcionando
- [ ] Health checks passando
- [ ] Autenticação JWT funcionando
- [ ] Sistema de roles funcionando
- [ ] Rate limiting funcionando
- [ ] Logs sendo gerados
- [ ] Monitoramento configurado

### Manutenção

- [ ] Backup automático configurado
- [ ] Logs sendo rotacionados
- [ ] Monitoramento de recursos
- [ ] Atualizações de segurança
- [ ] Testes regulares de funcionalidade

---

## 🎯 Status Atual do Homelab

- ✅ **Deploy**: Automatizado e funcionando
- ✅ **API**: Respondendo em `192.168.31.75:3000`
- ✅ **Proxy**: Nginx em `192.168.31.75:80`
- ✅ **MongoDB**: Conectado externamente
- ✅ **Redis**: Containerizado e funcionando
- ✅ **Autenticação**: JWT funcionando
- ✅ **Roles**: Sistema de permissões funcionando
- ✅ **Rate Limiting**: Funcionando
- ✅ **Health Checks**: Implementados
- ✅ **Monitoramento**: Scripts configurados

**🎉 Sistema totalmente operacional no homelab!**
