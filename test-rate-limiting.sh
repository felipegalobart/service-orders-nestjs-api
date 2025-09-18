#!/bin/bash

# Script para testar Rate Limiting
echo "🚀 Testando Rate Limiting da API..."
echo "=================================="

BASE_URL="http://localhost:3000"

# Função para fazer requisições e mostrar status
test_endpoint() {
    local endpoint=$1
    local method=$2
    local data=$3
    local description=$4
    
    echo ""
    echo "📡 Testando: $description"
    echo "Endpoint: $method $endpoint"
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X GET \
            "$BASE_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    echo "Status: $http_code"
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "✅ Sucesso"
    elif [ "$http_code" = "429" ]; then
        echo "🚫 Rate Limited (esperado após muitas requisições)"
    else
        echo "❌ Erro"
        echo "Response: $body"
    fi
}

# Aguardar servidor inicializar
echo "⏳ Aguardando servidor inicializar..."
sleep 3

# Teste 1: Endpoints de autenticação (limite: 5/min)
echo ""
echo "🔐 TESTE 1: Rate Limiting em endpoints de autenticação (limite: 5/min)"
echo "=================================================================="

for i in {1..7}; do
    echo ""
    echo "--- Tentativa $i ---"
    test_endpoint "/auth/login" "POST" '{"email":"test@example.com","password":"123456"}' "Login (deve falhar após 5 tentativas)"
done

# Teste 2: Endpoint público (limite: 20/min)
echo ""
echo "🌐 TESTE 2: Rate Limiting em endpoints públicos (limite: 20/min)"
echo "=============================================================="

for i in {1..22}; do
    echo ""
    echo "--- Tentativa $i ---"
    test_endpoint "/auth/register" "POST" '{"email":"test'$i'@example.com","password":"123456","name":"Test User"}' "Registro (deve falhar após 20 tentativas)"
done

# Teste 3: Endpoint protegido (limite: 10/min)
echo ""
echo "👤 TESTE 3: Rate Limiting em endpoints de usuário (limite: 10/min)"
echo "==============================================================="

# Primeiro fazer login para obter token
echo "Fazendo login para obter token..."
login_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"123456"}' \
    "$BASE_URL/auth/login")

token=$(echo "$login_response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$token" ]; then
    echo "❌ Não foi possível obter token. Criando usuário primeiro..."
    
    # Criar usuário admin primeiro
    curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@example.com","password":"123456","name":"Admin User","role":"admin"}' \
        "$BASE_URL/auth/register"
    
    # Tentar login novamente
    login_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"email":"admin@example.com","password":"123456"}' \
        "$BASE_URL/auth/login")
    
    token=$(echo "$login_response" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
fi

if [ -n "$token" ]; then
    echo "✅ Token obtido: ${token:0:20}..."
    
    for i in {1..12}; do
        echo ""
        echo "--- Tentativa $i ---"
        test_endpoint "/users/profile" "GET" "" "Perfil do usuário (deve falhar após 10 tentativas)"
    done
else
    echo "❌ Não foi possível obter token para teste de endpoints protegidos"
fi

echo ""
echo "🏁 Testes de Rate Limiting concluídos!"
echo "====================================="
echo ""
echo "📊 Resumo dos limites configurados:"
echo "• Endpoints de autenticação: 5 requests/minuto"
echo "• Endpoints públicos: 20 requests/minuto"  
echo "• Endpoints de usuário: 10 requests/minuto"
echo "• Endpoints administrativos: 3 requests/minuto"
echo ""
echo "💡 Status 429 = Rate Limited (comportamento esperado)"
echo "💡 Status 200/201 = Request permitida"
