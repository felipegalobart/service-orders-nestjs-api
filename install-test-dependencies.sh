#!/bin/bash

echo "🧪 Instalando dependências para testes..."
echo "========================================"

# Instalar dependências de teste
npm install --save-dev mongodb-memory-server

echo ""
echo "✅ Dependências instaladas com sucesso!"
echo ""
echo "📋 Comandos disponíveis:"
echo "• npm run test          - Executar todos os testes"
echo "• npm run test:unit     - Executar apenas testes unitários"
echo "• npm run test:e2e      - Executar apenas testes E2E"
echo "• npm run test:cov      - Executar testes com cobertura"
echo "• npm run test:watch    - Executar testes em modo watch"
echo ""
echo "🚀 Execute 'npm run test' para começar!"
