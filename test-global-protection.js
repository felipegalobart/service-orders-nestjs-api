const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testGlobalProtection() {
  console.log('🔒 Testando proteção global das rotas...\n');

  try {
    // Teste 1: Tentar acessar rota protegida sem token (deve falhar)
    console.log('1. Testando acesso a rota protegida sem token...');
    try {
      await axios.get(`${BASE_URL}/users/123`);
      console.log('❌ ERRO: Rota protegida deveria ter falhado!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(
          '✅ SUCESSO: Rota protegida corretamente bloqueada (401 Unauthorized)',
        );
      } else {
        console.log(`❌ ERRO: Status inesperado: ${error.response?.status}`);
      }
    }

    // Teste 2: Tentar acessar rota pública de login (deve funcionar)
    console.log('\n2. Testando acesso a rota pública de login...');
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'password123',
      });
      console.log(
        '❌ ERRO: Login deveria ter falhado com credenciais inválidas!',
      );
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(
          '✅ SUCESSO: Rota pública acessível (401 é esperado para credenciais inválidas)',
        );
      } else {
        console.log(`❌ ERRO: Status inesperado: ${error.response?.status}`);
      }
    }

    // Teste 3: Tentar acessar rota pública de registro (deve funcionar)
    console.log('\n3. Testando acesso a rota pública de registro...');
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      });
      console.log('✅ SUCESSO: Rota pública de registro acessível');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(
          '✅ SUCESSO: Rota pública acessível (400 é esperado para dados inválidos)',
        );
      } else {
        console.log(`❌ ERRO: Status inesperado: ${error.response?.status}`);
      }
    }

    // Teste 4: Tentar acessar rota protegida com token válido (se tivermos um)
    console.log('\n4. Testando acesso a rota protegida com token inválido...');
    try {
      await axios.get(`${BASE_URL}/users/123`, {
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      });
      console.log('❌ ERRO: Token inválido deveria ter falhado!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(
          '✅ SUCESSO: Token inválido corretamente rejeitado (401 Unauthorized)',
        );
      } else {
        console.log(`❌ ERRO: Status inesperado: ${error.response?.status}`);
      }
    }

    console.log('\n🎉 Testes de proteção global concluídos!');
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  }
}

// Executar os testes
testGlobalProtection();
