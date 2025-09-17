# Formatação Automática com Prettier

Este projeto está configurado para formatação automática ao salvar usando Prettier e ESLint.

## Configuração do VS Code

O arquivo `.vscode/settings.json` está configurado para:

- ✅ **Formatação automática ao salvar** (`formatOnSave: true`)
- ✅ **Prettier como formatador padrão** para TypeScript, JavaScript, JSON e Markdown
- ✅ **Correção automática do ESLint** ao salvar
- ✅ **Uso obrigatório do arquivo de configuração** do Prettier

## Scripts NPM Disponíveis

### Formatação

```bash
# Formatar todos os arquivos
npm run format

# Verificar se os arquivos estão formatados
npm run format:check
```

### Linting

```bash
# Corrigir problemas de linting automaticamente
npm run lint

# Verificar problemas de linting (sem corrigir)
npm run lint:check
```

### Combinado

```bash
# Formatar e corrigir linting em sequência
npm run format:lint
```

## Como Funciona

### 1. Ao Salvar no VS Code

- Prettier formata o código automaticamente
- ESLint corrige problemas automaticamente
- Arquivo fica consistente com as regras do projeto

### 2. Via Terminal

- Use `npm run format` para formatar todos os arquivos
- Use `npm run lint` para corrigir problemas de ESLint
- Use `npm run format:lint` para fazer ambos

### 3. Verificação

- Use `npm run format:check` para verificar formatação
- Use `npm run lint:check` para verificar problemas de linting

## Configurações do Prettier

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": true,
  "endOfLine": "auto"
}
```

## Extensões Recomendadas

Para VS Code, instale:

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)

## Benefícios

- 🎯 **Consistência**: Código sempre formatado igual
- ⚡ **Produtividade**: Não precisa formatar manualmente
- 🔧 **Manutenibilidade**: Código limpo e organizado
- 👥 **Colaboração**: Todos seguem o mesmo padrão
