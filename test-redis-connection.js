#!/usr/bin/env node

/**
 * Script para testar a conexão com Redis
 * Execute: node test-redis-connection.js
 */

const Redis = require('ioredis');
require('dotenv').config();

async function testRedisConnection() {
  console.log('🔍 Testando conexão com Redis...\n');

  const redisConfig = {
    host: process.env.REDIS_HOST || '192.168.31.75',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  };

  console.log('📋 Configuração Redis:');
  console.log(`   Host: ${redisConfig.host}`);
  console.log(`   Port: ${redisConfig.port}`);
  console.log(
    `   Password: ${redisConfig.password ? '***configurado***' : 'não configurado'}`,
  );
  console.log('');

  const redis = new Redis(redisConfig);

  try {
    // Teste de conexão
    console.log('🔄 Tentando conectar...');
    await redis.connect();
    console.log('✅ Conexão estabelecida com sucesso!');

    // Teste básico
    console.log('🔄 Testando operações básicas...');
    await redis.set('test:connection', 'OK');
    const result = await redis.get('test:connection');
    console.log(`✅ GET/SET funcionando: ${result}`);

    // Teste de incremento (usado pelo rate limiting)
    console.log('🔄 Testando incremento...');
    const count = await redis.incr('test:counter');
    console.log(`✅ INCR funcionando: ${count}`);

    // Teste de expiração
    console.log('🔄 Testando expiração...');
    await redis.setex('test:expire', 1, 'temp');
    console.log('✅ SETEX funcionando');

    // Aguardar expiração
    setTimeout(async () => {
      const expired = await redis.get('test:expire');
      console.log(
        `✅ Expiração funcionando: ${expired === null ? 'chave expirada' : 'chave ainda existe'}`,
      );
    }, 1100);

    // Limpeza
    await redis.del('test:connection', 'test:counter');
    console.log('🧹 Limpeza concluída');

    console.log(
      '\n🎉 Todos os testes passaram! Redis está funcionando corretamente.',
    );
  } catch (error) {
    console.error('\n❌ Erro ao conectar com Redis:');
    console.error(`   ${error.message}`);
    console.error('\n🔧 Possíveis soluções:');
    console.error('   1. Verifique se o Redis está rodando: docker ps');
    console.error('   2. Verifique as variáveis de ambiente');
    console.error('   3. Verifique se a senha está correta');
    console.error('   4. Execute: docker-compose up redis -d');

    process.exit(1);
  } finally {
    await redis.disconnect();
    console.log('🔌 Conexão fechada');
  }
}

// Executar teste
testRedisConnection().catch(console.error);
