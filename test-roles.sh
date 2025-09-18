#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🔐 Testando Sistema de Roles..."
echo ""

# Função para fazer login e obter token
login_user() {
    local email=$1
    local password=$2
    curl -s -X POST "$BASE_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}" | jq -r '.access_token'
}

# Função para testar endpoint com token
test_endpoint() {
    local method=$1
    local endpoint=$2
    local token=$3
    local data=$4
    
    if [ -n "$data" ]; then
        curl -s -o /dev/null -w "%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data"
    else
        curl -s -o /dev/null -w "%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $token"
    fi
}

echo "1. Criando usuários com diferentes roles..."

# Criar usuário comum
echo "   - Criando usuário comum..."
USER_TOKEN=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"user@test.com","password":"password123","name":"User Test"}' | jq -r '.access_token')

# Criar usuário admin
echo "   - Criando usuário admin..."
ADMIN_TOKEN=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@test.com","password":"password123","name":"Admin Test","role":"admin"}' | jq -r '.access_token')

# Criar usuário moderador
echo "   - Criando usuário moderador..."
MODERATOR_TOKEN=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"moderator@test.com","password":"password123","name":"Moderator Test","role":"moderator"}' | jq -r '.access_token')

echo ""
echo "2. Testando acesso ao perfil próprio (deve funcionar para todos)..."
echo "   - Usuário comum: $(test_endpoint "GET" "/users/profile" "$USER_TOKEN")"
echo "   - Admin: $(test_endpoint "GET" "/users/profile" "$ADMIN_TOKEN")"
echo "   - Moderador: $(test_endpoint "GET" "/users/profile" "$MODERATOR_TOKEN")"

echo ""
echo "3. Testando listagem de todos os usuários (apenas admin)..."
echo "   - Usuário comum: $(test_endpoint "GET" "/users" "$USER_TOKEN")"
echo "   - Admin: $(test_endpoint "GET" "/users" "$ADMIN_TOKEN")"
echo "   - Moderador: $(test_endpoint "GET" "/users" "$MODERATOR_TOKEN")"

echo ""
echo "4. Testando acesso a usuário por ID (apenas admin)..."
USER_ID=$(curl -s -X GET "$BASE_URL/users/profile" -H "Authorization: Bearer $USER_TOKEN" | jq -r '.id')
echo "   - Usuário comum: $(test_endpoint "GET" "/users/$USER_ID" "$USER_TOKEN")"
echo "   - Admin: $(test_endpoint "GET" "/users/$USER_ID" "$ADMIN_TOKEN")"
echo "   - Moderador: $(test_endpoint "GET" "/users/$USER_ID" "$MODERATOR_TOKEN")"

echo ""
echo "5. Testando atualização de perfil próprio..."
echo "   - Usuário comum: $(test_endpoint "PUT" "/users/$USER_ID" "$USER_TOKEN" '{"name":"Updated User"}')"
echo "   - Admin: $(test_endpoint "PUT" "/users/$USER_ID" "$ADMIN_TOKEN" '{"name":"Updated by Admin"}')"

echo ""
echo "6. Testando atualização de role (apenas admin)..."
echo "   - Usuário comum tentando alterar role: $(test_endpoint "PUT" "/users/$USER_ID" "$USER_TOKEN" '{"role":"admin"}')"
echo "   - Admin alterando role: $(test_endpoint "PUT" "/users/$USER_ID" "$ADMIN_TOKEN" '{"role":"moderator"}')"

echo ""
echo "7. Testando deleção de usuário (apenas admin)..."
echo "   - Usuário comum: $(test_endpoint "DELETE" "/users/$USER_ID" "$USER_TOKEN")"
echo "   - Admin: $(test_endpoint "DELETE" "/users/$USER_ID" "$ADMIN_TOKEN")"

echo ""
echo "🎉 Testes de roles concluídos!"
echo ""
echo "📊 Códigos de status esperados:"
echo "   - 200: Sucesso"
echo "   - 403: Acesso negado (role insuficiente)"
echo "   - 401: Não autenticado"
echo "   - 404: Não encontrado"
