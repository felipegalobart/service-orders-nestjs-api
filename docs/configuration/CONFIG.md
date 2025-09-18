# Configuração de Variáveis de Ambiente

Este projeto utiliza o `@nestjs/config` para gerenciar variáveis de ambiente de forma segura e tipada.

## Arquivos de Configuração

- `.env` - Arquivo com as variáveis de ambiente (não versionado)
- `.env.example` - Template das variáveis de ambiente (versionado)
- `src/config/app.config.ts` - Interface e função de configuração tipada

## Como Usar

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e ajuste os valores:

```bash
cp .env.example .env
```

### 2. Usar ConfigService em Serviços

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MeuService {
  constructor(private configService: ConfigService) {}

  getDatabaseUri(): string {
    return (
      this.configService.get<string>('mongodbUri') ||
      'mongodb://localhost:27017/service-orders'
    );
  }
}
```

**⚠️ Importante**: O `ConfigService.get()` retorna `string | undefined`, então sempre forneça um valor padrão usando `||` para evitar erros de tipo.

### 3. Variáveis Disponíveis

- `NODE_ENV` - Ambiente de execução (development, production, test)
- `PORT` - Porta do servidor
- `MONGODB_URI` - URI de conexão com MongoDB
- `JWT_SECRET` - Chave secreta para JWT
- `JWT_EXPIRES_IN` - Tempo de expiração do JWT
- `API_PREFIX` - Prefixo da API
- `CORS_ORIGIN` - Origem permitida para CORS
- `LOG_LEVEL` - Nível de log

### 4. Configuração Global

O `ConfigModule` está configurado como global, então você pode usar o `ConfigService` em qualquer lugar da aplicação sem importar o módulo.

### 5. Validação (Opcional)

Para adicionar validação das variáveis de ambiente, você pode usar o `class-validator`:

```bash
npm install class-validator class-transformer
```

E criar um schema de validação no arquivo de configuração.
