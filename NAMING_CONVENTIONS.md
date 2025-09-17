# Convenções de Nomenclatura

## Interfaces

Todas as interfaces devem seguir a convenção de nomenclatura com prefixo `I`:

### ✅ Correto
```typescript
export interface IUser {
  id: string;
  name: string;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
}
```

### ❌ Incorreto
```typescript
export interface User {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}
```

## Regra ESLint

O ESLint está configurado para avisar quando você esquecer do prefixo `I` nas interfaces:

- **Regra**: `@typescript-eslint/naming-convention`
- **Severidade**: `error`
- **Ação**: O código não compilará até que a interface seja renomeada com o prefixo `I`

## Benefícios

- **Consistência**: Mantém um padrão uniforme em todo o projeto
- **Clareza**: Facilita a identificação de interfaces vs classes
- **Manutenibilidade**: Reduz confusão durante o desenvolvimento
- **Padrão**: Segue convenções amplamente aceitas no TypeScript
