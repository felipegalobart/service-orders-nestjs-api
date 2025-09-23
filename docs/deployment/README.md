# 🚀 Deployment & Docker

Esta seção contém toda a documentação relacionada ao deployment da aplicação usando Docker e configurações para produção.

## 📁 Arquivos de Deployment

- **[DOCKER.md](./DOCKER.md)** - Guia completo de Docker e containerização
- **[HOMELAB_DEPLOYMENT.md](./HOMELAB_DEPLOYMENT.md)** - Guia específico para deployment no homelab
- **[PRODUCTION_CONFIG.md](./PRODUCTION_CONFIG.md)** - Configurações de produção
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Solução de problemas comuns

## 🐳 Docker

### Arquivos Docker

- `Dockerfile` - Imagem da aplicação
- `docker-compose.yml` - Orquestração de serviços
- `.dockerignore` - Arquivos ignorados no build
- `docker/nginx.conf` - Configuração do Nginx
- `docker/mongo-init.js` - Inicialização do MongoDB

### Scripts de Deployment

- `deploy-homelab.sh` - Script automatizado para homelab
- `test-interface.ts` - Interface de testes
- `test-person-endpoints.js` - Testes de endpoints

## 🌐 Homelab

### Configuração Atual

- **IP**: `192.168.31.75`
- **Porta**: `3000` (aplicação), `80` (Nginx)
- **MongoDB**: Externo (`mongodb://serviceuser:servicepass@192.168.31.75:27017/service-orders`)
- **Redis**: Containerizado
- **Nginx**: Reverse proxy

### Status dos Serviços

- ✅ **API**: Funcionando
- ✅ **MongoDB**: Conectado externamente
- ✅ **Redis**: Funcionando
- ✅ **Nginx**: Funcionando
- ✅ **Autenticação**: JWT funcionando
- ✅ **Roles**: Sistema de permissões funcionando

## 🔧 Comandos Úteis

```bash
# Deploy completo
./deploy-homelab.sh

# Verificar logs
docker-compose logs -f

# Testar conectividade
curl http://192.168.31.75:3000/health

# Testar via Nginx
curl http://192.168.31.75:80/health
```

## 📋 Checklist de Deployment

- [ ] MongoDB externo configurado
- [ ] Arquivo `.env.production` configurado
- [ ] Docker e Docker Compose instalados
- [ ] Portas 3000 e 80 disponíveis
- [ ] Script `deploy-homelab.sh` executável
- [ ] Testes de conectividade passando
- [ ] Autenticação funcionando
- [ ] Rate limiting funcionando
