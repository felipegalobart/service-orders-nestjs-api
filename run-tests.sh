#!/bin/bash

echo "🧪 Executando Testes - Service Orders NestJS API"
echo "================================================"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules/mongodb-memory-server" ]; then
    echo "⚠️  Dependências de teste não encontradas."
    echo "📦 Executando instalação..."
    ./install-test-dependencies.sh
fi

echo ""
echo "🔍 Executando verificação de lint..."
npm run lint:check

echo ""
echo "🧪 Executando testes unitários..."
npm run test:unit

echo ""
echo "🔗 Executando testes de integração..."
npm run test:e2e

echo ""
echo "📊 Executando testes com cobertura..."
npm run test:cov

echo ""
echo "✅ Todos os testes concluídos!"
echo ""
echo "📈 Para ver o relatório de cobertura:"
echo "   open coverage/lcov-report/index.html"
