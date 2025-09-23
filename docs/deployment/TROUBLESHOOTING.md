# 🔧 Troubleshooting

Guia de solução de problemas comuns na Service Orders API.

## 📋 Índice

- [🐳 Problemas Docker](#-problemas-docker)
- [🗄️ Problemas MongoDB](#️-problemas-mongodb)
- [🔐 Problemas Autenticação](#-problemas-autenticação)
- [🌐 Problemas Rede](#-problemas-rede)
- [⚡ Problemas Performance](#-problemas-performance)
- [📊 Problemas Logs](#-problemas-logs)

## 🐳 Problemas Docker

### 1. Porta 443 já em uso

**Erro:**

```bash
Error response from daemon: failed to bind host port for 0.0.0.0:443:172.20.0.4:443/tcp: address already in use
```

**Solução:**

```bash
# Remover porta 443 do docker-compose.yml
# Ou parar serviço que está usando a porta
sudo lsof -i :443
sudo systemctl stop apache2  # ou nginx
```

### 2. main.js não encontrado

**Erro:**

```bash
Error: Cannot find module '/app/dist/main.js'
```

**Solução:**

```dockerfile
# Corrigir CMD no Dockerfile
CMD ["node", "dist/src/main.js"]  # ← Adicionar /src/
```

### 3. docker-compose: command not found

**Erro:**

```bash
./deploy-homelab.sh: line 64: docker-compose: command not found
```

**Solução:**

```bash
# Instalar docker-compose
sudo apt install docker-compose

# Ou usar docker compose (versão mais nova)
# O script já detecta automaticamente
```

### 4. Container não inicia

**Diagnóstico:**

```bash
# Ver logs do container
docker-compose logs app

# Verificar status
docker-compose ps

# Entrar no container
docker exec -it service-orders-api sh
```

**Soluções:**

```bash
# Rebuild completo
docker-compose down
docker-compose up --build -d

# Limpar cache
docker system prune -f
docker-compose up --build -d
```

## 🗄️ Problemas MongoDB

### 1. Command find requires authentication

**Erro:**

```bash
MongoServerError: Command find requires authentication
```

**Solução:**

```bash
# Verificar string de conexão
MONGODB_URI=mongodb://serviceuser:servicepass@192.168.31.75:27017/service-orders?authSource=admin

# Testar conexão
mongosh "mongodb://serviceuser:servicepass@192.168.31.75:27017/service-orders?authSource=admin"
```

### 2. MongoDB não conecta

**Diagnóstico:**

```bash
# Testar conectividade
nc -z 192.168.31.75 27017

# Testar com telnet
telnet 192.168.31.75 27017

# Verificar firewall
sudo ufw status
```

**Soluções:**

```bash
# Permitir porta no firewall
sudo ufw allow 27017

# Verificar se MongoDB está rodando
sudo systemctl status mongod

# Reiniciar MongoDB
sudo systemctl restart mongod
```

### 3. Database não existe

**Erro:**

```bash
Database service-orders does not exist
```

**Solução:**

```bash
# Criar database
mongosh "mongodb://serviceuser:servicepass@192.168.31.75:27017/service-orders?authSource=admin"

# Executar script de inicialização
mongo < docker/mongo-init.js
```

## 🔐 Problemas Autenticação

### 1. JWT inválido

**Erro:**

```bash
UnauthorizedException: Invalid token
```

**Soluções:**

```bash
# Verificar JWT_SECRET
echo $JWT_SECRET

# Gerar novo token
curl -X POST http://192.168.31.75:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@homelab.com","password":"admin123"}'

# Verificar expiração do token
# Tokens expiram em 7 dias por padrão
```

### 2. Role insuficiente

**Erro:**

```bash
ForbiddenException: Insufficient permissions
```

**Solução:**

```bash
# Verificar role do usuário
curl -H "Authorization: Bearer $TOKEN" \
  http://192.168.31.75:3000/users/profile

# Promover usuário para admin
curl -X PUT -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}' \
  http://192.168.31.75:3000/users/USER_ID
```

### 3. Usuário não encontrado

**Erro:**

```bash
NotFoundException: User not found
```

**Solução:**

```bash
# Verificar se usuário existe
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://192.168.31.75:3000/users

# Criar novo usuário
curl -X POST http://192.168.31.75:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"User","role":"user"}'
```

## 🌐 Problemas Rede

### 1. Conectividade API

**Diagnóstico:**

```bash
# Testar conectividade
curl http://192.168.31.75:3000/health

# Verificar se porta está aberta
nc -z 192.168.31.75 3000

# Verificar firewall
sudo ufw status
```

**Soluções:**

```bash
# Permitir porta no firewall
sudo ufw allow 3000

# Verificar se container está rodando
docker-compose ps

# Reiniciar container
docker-compose restart app
```

### 2. Nginx não responde

**Erro:**

```bash
curl: (7) Failed to connect to 192.168.31.75 port 80: Connection refused
```

**Diagnóstico:**

```bash
# Verificar logs do Nginx
docker-compose logs nginx

# Verificar configuração
docker exec service-orders-nginx nginx -t

# Verificar se upstream está funcionando
docker exec service-orders-nginx curl http://app:3000/health
```

**Soluções:**

```bash
# Reiniciar Nginx
docker-compose restart nginx

# Verificar configuração
cat docker/nginx.conf

# Rebuild Nginx
docker-compose up --build -d nginx
```

### 3. DNS não resolve

**Erro:**

```bash
getaddrinfo ENOTFOUND app
```

**Solução:**

```bash
# Verificar rede Docker
docker network ls
docker network inspect service-orders-network

# Recriar rede
docker-compose down
docker network prune -f
docker-compose up -d
```

## ⚡ Problemas Performance

### 1. API lenta

**Diagnóstico:**

```bash
# Verificar uso de recursos
docker stats

# Verificar logs de performance
docker-compose logs app | grep -i "slow"

# Verificar conexões MongoDB
mongosh --eval "db.serverStatus().connections"
```

**Soluções:**

```bash
# Aumentar recursos do container
# No docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '0.5'

# Otimizar MongoDB
# Criar índices necessários
db.users.createIndex({ "email": 1 })
db.persons.createIndex({ "name": 1 })
```

### 2. Rate limiting muito restritivo

**Erro:**

```bash
ThrottlerException: Too Many Requests
```

**Solução:**

```bash
# Ajustar configurações no .env.production
THROTTLE_TTL=60      # Tempo em segundos
THROTTLE_LIMIT=100   # Limite de requisições

# Reiniciar aplicação
docker-compose restart app
```

### 3. Redis não responde

**Erro:**

```bash
Redis connection error
```

**Diagnóstico:**

```bash
# Verificar status do Redis
docker-compose logs redis

# Testar conexão
docker exec service-orders-redis redis-cli ping
```

**Solução:**

```bash
# Reiniciar Redis
docker-compose restart redis

# Verificar senha
docker exec service-orders-redis redis-cli -a $REDIS_PASSWORD ping
```

## 📊 Problemas Logs

### 1. Logs não aparecem

**Diagnóstico:**

```bash
# Verificar se logs estão sendo gerados
docker-compose logs app

# Verificar nível de log
echo $LOG_LEVEL

# Verificar configuração de log
docker exec service-orders-api env | grep LOG
```

**Solução:**

```bash
# Ajustar nível de log no .env.production
LOG_LEVEL=debug

# Reiniciar aplicação
docker-compose restart app
```

### 2. Logs muito verbosos

**Solução:**

```bash
# Reduzir verbosidade
LOG_LEVEL=info

# Filtrar logs
docker-compose logs app | grep ERROR
docker-compose logs app | grep WARN
```

### 3. Logs não persistem

**Solução:**

```bash
# Configurar volumes para logs
# No docker-compose.yml:
volumes:
  - ./logs:/app/logs

# Configurar rotação de logs
# No Dockerfile:
RUN mkdir -p /app/logs
```

## 🔍 Comandos de Debug

### Diagnóstico Completo

```bash
#!/bin/bash
echo "🔍 Diagnóstico completo do sistema..."

# 1. Status dos containers
echo "1. Status dos containers:"
docker-compose ps

# 2. Uso de recursos
echo "2. Uso de recursos:"
docker stats --no-stream

# 3. Conectividade
echo "3. Testando conectividade:"
curl -f http://192.168.31.75:3000/health && echo "✅ API OK" || echo "❌ API FALHA"
curl -f http://192.168.31.75:80/health && echo "✅ Nginx OK" || echo "❌ Nginx FALHA"
nc -z 192.168.31.75 27017 && echo "✅ MongoDB OK" || echo "❌ MongoDB FALHA"

# 4. Logs recentes
echo "4. Logs recentes (últimas 10 linhas):"
docker-compose logs --tail=10 app
docker-compose logs --tail=10 nginx
docker-compose logs --tail=10 redis

# 5. Espaço em disco
echo "5. Espaço em disco:"
df -h
docker system df

# 6. Variáveis de ambiente
echo "6. Variáveis críticas:"
docker exec service-orders-api env | grep -E "(MONGODB_URI|JWT_SECRET|NODE_ENV)"

echo "✅ Diagnóstico concluído!"
```

### Reset Completo

```bash
#!/bin/bash
echo "🔄 Reset completo do sistema..."

# 1. Parar tudo
docker-compose down

# 2. Remover volumes
docker volume prune -f

# 3. Remover imagens
docker image prune -f

# 4. Limpar sistema
docker system prune -f

# 5. Rebuild completo
docker-compose up --build -d

# 6. Aguardar inicialização
sleep 15

# 7. Verificar saúde
curl http://192.168.31.75:3000/health

echo "✅ Reset concluído!"
```

## 📞 Suporte

### Informações para Suporte

Ao reportar problemas, inclua:

1. **Versão do Docker:**

   ```bash
   docker --version
   docker-compose --version
   ```

2. **Logs completos:**

   ```bash
   docker-compose logs > logs.txt
   ```

3. **Status dos containers:**

   ```bash
   docker-compose ps > status.txt
   ```

4. **Configuração:**

   ```bash
   cat .env.production > config.txt
   ```

5. **Sistema:**

   ```bash
   uname -a > system.txt
   ```

### Logs Importantes

- **API**: `docker-compose logs app`
- **Nginx**: `docker-compose logs nginx`
- **Redis**: `docker-compose logs redis`
- **Sistema**: `journalctl -u docker`

---

## 🎯 Checklist de Troubleshooting

### Problemas Comuns

- [ ] **Docker**: Containers não iniciam
- [ ] **MongoDB**: Conexão falha
- [ ] **JWT**: Token inválido
- [ ] **Roles**: Permissão negada
- [ ] **Rede**: Conectividade falha
- [ ] **Performance**: API lenta
- [ ] **Logs**: Não aparecem
- [ ] **Rate Limit**: Muito restritivo

### Soluções Aplicadas

- [ ] **Porta 443**: Removida do compose
- [ ] **main.js**: Caminho corrigido
- [ ] **docker-compose**: Detecção automática
- [ ] **MongoDB**: Auth configurada
- [ ] **JWT**: Secret configurado
- [ ] **Roles**: Sistema funcionando
- [ ] **Nginx**: Proxy configurado
- [ ] **Redis**: Senha configurada

**🔧 Sistema de troubleshooting implementado e funcionando!**
