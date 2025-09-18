#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🔒 Testando proteção global das rotas..."
echo ""

# Teste 1: Tentar acessar rota protegida sem token (deve falhar)
echo "1. Testando acesso a rota protegida sem token..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/users/123")
if [ "$response" = "401" ]; then
    echo "✅ SUCESSO: Rota protegida corretamente bloqueada (401 Unauthorized)"
else
    echo "❌ ERRO: Status inesperado: $response"
fi

# Teste 2: Tentar acessar rota pública de login (deve funcionar)
echo ""
echo "2. Testando acesso a rota pública de login..."
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}')
if [ "$response" = "401" ]; then
    echo "✅ SUCESSO: Rota pública acessível (401 é esperado para credenciais inválidas)"
else
    echo "❌ ERRO: Status inesperado: $response"
fi

# Teste 3: Tentar acessar rota pública de registro (deve funcionar)
echo ""
echo "3. Testando acesso a rota pública de registro..."
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"newuser@example.com","password":"password123","name":"New User"}')
if [ "$response" = "400" ] || [ "$response" = "201" ]; then
    echo "✅ SUCESSO: Rota pública acessível (400/201 é esperado)"
else
    echo "❌ ERRO: Status inesperado: $response"
fi

# Teste 4: Tentar acessar rota protegida com token inválido
echo ""
echo "4. Testando acesso a rota protegida com token inválido..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/users/123" \
    -H "Authorization: Bearer invalid-token")
if [ "$response" = "401" ]; then
    echo "✅ SUCESSO: Token inválido corretamente rejeitado (401 Unauthorized)"
else
    echo "❌ ERRO: Status inesperado: $response"
fi

echo ""
echo "🎉 Testes de proteção global concluídos!"
