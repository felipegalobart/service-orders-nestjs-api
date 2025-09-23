# Service Orders API - Docker Deployment

Este projeto está configurado para rodar em containers Docker, ideal para deployment em homelab ou ambiente de produção.

## 🐳 Arquitetura Docker

O projeto utiliza uma arquitetura multi-container com os seguintes serviços:

- **app**: Aplicação NestJS (porta 3000)
- **mongodb**: Banco de dados MongoDB (porta 27017)
- **redis**: Cache Redis para rate limiting (porta 6379)
- **nginx**: Reverse proxy e load balancer (porta 80/443)

## 🚀 Deploy Rápido

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone <seu-repositorio>
cd service-orders-nestjs-api

# Configure as variáveis de ambiente
cp env.production.example .env.production
# Edite .env.production com suas configurações
```

### 2. Deploy Automático

```bash
# Execute o script de deploy
./deploy-homelab.sh
```

### 3. Deploy Manual

```bash
# Build e start dos containers
docker-compose up --build -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

## 🔧 Configuração

### Variáveis de Ambiente

Edite o arquivo `.env.production` com suas configurações:

```env
# Application
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://mongodb:27017/service-orders
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Redis
REDIS_PASSWORD=your-secure-redis-password
```

### Portas

- **3000**: API NestJS
- **27017**: MongoDB
- **6379**: Redis
- **80**: Nginx HTTP
- **443**: Nginx HTTPS (configure SSL)

## 📊 Monitoramento

### Health Checks

Todos os serviços possuem health checks configurados:

```bash
# Verificar saúde dos serviços
docker-compose ps

# Health check da API
curl http://localhost:3000/health
```

### Logs

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs específicos
docker-compose logs -f app
docker-compose logs -f mongodb
docker-compose logs -f redis
```

## 🔒 Segurança

### Configurações Recomendadas

1. **Altere todas as senhas padrão**
2. **Configure SSL/TLS** para HTTPS
3. **Configure firewall** para limitar acesso
4. **Backup regular** do MongoDB
5. **Monitoramento** de logs e métricas

### SSL/TLS

Para habilitar HTTPS:

1. Coloque seus certificados SSL em `docker/ssl/`
2. Descomente a configuração HTTPS no `docker/nginx.conf`
3. Reinicie o nginx: `docker-compose restart nginx`

## 🛠️ Comandos Úteis

### Gerenciamento de Containers

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Reiniciar um serviço específico
docker-compose restart app

# Atualizar e rebuild
docker-compose pull
docker-compose up --build -d
```

### Acesso aos Serviços

```bash
# Acessar MongoDB
docker-compose exec mongodb mongosh

# Acessar Redis
docker-compose exec redis redis-cli

# Acessar container da aplicação
docker-compose exec app sh
```

### Backup e Restore

```bash
# Backup do MongoDB
docker-compose exec mongodb mongodump --out /backup

# Restore do MongoDB
docker-compose exec mongodb mongorestore /backup
```

## 📈 Performance

### Otimizações Implementadas

- **Multi-stage build** para imagens menores
- **Non-root user** para segurança
- **Health checks** para monitoramento
- **Rate limiting** via Redis
- **Nginx caching** e compressão
- **Connection pooling** para MongoDB

### Recursos Recomendados

- **CPU**: 2+ cores
- **RAM**: 4GB+ (2GB para MongoDB, 1GB para app, 512MB para Redis)
- **Storage**: 20GB+ SSD
- **Network**: 100Mbps+

## 🐛 Troubleshooting

### Problemas Comuns

1. **Porta já em uso**

   ```bash
   # Verificar portas em uso
   netstat -tulpn | grep :3000
   # Alterar porta no docker-compose.yml
   ```

2. **Erro de conexão MongoDB**

   ```bash
   # Verificar logs do MongoDB
   docker-compose logs mongodb
   # Verificar se o serviço está saudável
   docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
   ```

3. **API não responde**
   ```bash
   # Verificar logs da aplicação
   docker-compose logs app
   # Verificar health check
   curl http://localhost:3000/health
   ```

### Logs Detalhados

```bash
# Logs com timestamps
docker-compose logs -f -t

# Logs de erro apenas
docker-compose logs --tail=100 app | grep ERROR
```

## 🔄 Updates

### Atualização da Aplicação

```bash
# Pull das últimas mudanças
git pull origin main

# Rebuild e restart
docker-compose up --build -d
```

### Atualização de Dependências

```bash
# Atualizar imagens base
docker-compose pull

# Rebuild com novas imagens
docker-compose up --build -d
```

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs: `docker-compose logs -f`
2. Consulte a documentação da API: `docs/api/`
3. Verifique o status dos serviços: `docker-compose ps`

---

**Nota**: Este setup é otimizado para homelab e desenvolvimento. Para produção em escala, considere usar Kubernetes ou Docker Swarm com configurações adicionais de segurança e monitoramento.
