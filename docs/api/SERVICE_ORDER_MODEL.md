# 📋 Modelagem de Ordens de Serviço

## 📖 Visão Geral

Este documento descreve a modelagem completa do sistema de ordens de serviço, incluindo schemas, interfaces, enums e relacionamentos. Esta documentação serve como guia para implementação do backend e frontend.

## 🏗️ Arquitetura do Sistema

### **Módulos Principais**

- **ServiceOrder**: Ordem de serviço principal
- **Invoice**: Faturas (módulo futuro)
- **Counter**: Controle de sequência numérica

### **Relacionamentos**

```
ServiceOrder (1) ←→ (N) Invoice
ServiceOrder (1) ←→ (N) ServiceItem
Invoice (1) ←→ (N) InvoiceItem
```

## 📊 Schemas e Modelos

### **1. ServiceOrder (Ordem de Serviço)**

#### **Campos Principais**

| Campo                  | Tipo      | Obrigatório | Descrição                 |
| ---------------------- | --------- | ----------- | ------------------------- |
| `orderNumber`          | `number`  | ✅          | Número sequencial único   |
| `customerId`           | `string`  | ✅          | ID do cliente             |
| `equipment`            | `string`  | ✅          | Equipamento               |
| `model`                | `string`  | ❌          | Modelo do equipamento     |
| `brand`                | `string`  | ❌          | Marca do equipamento      |
| `serialNumber`         | `string`  | ❌          | Número de série           |
| `voltage`              | `string`  | ❌          | Voltagem (texto livre)    |
| `accessories`          | `string`  | ❌          | Acessórios (texto livre)  |
| `customerObservations` | `string`  | ❌          | Observações do cliente    |
| `reportedDefect`       | `string`  | ❌          | Defeito reclamado         |
| `warranty`             | `boolean` | ❌          | Garantia (default: false) |
| `isReturn`             | `boolean` | ❌          | Retorno (default: false)  |

#### **Status e Controle**

| Campo                  | Tipo                 | Obrigatório | Descrição                      |
| ---------------------- | -------------------- | ----------- | ------------------------------ |
| `status`               | `ServiceOrderStatus` | ✅          | Status da ordem                |
| `entryDate`            | `Date`               | ✅          | Data de entrada                |
| `approvalDate`         | `Date`               | ❌          | Data de aprovação              |
| `expectedDeliveryDate` | `Date`               | ❌          | Data prevista de entrega       |
| `deliveryDate`         | `Date`               | ❌          | Data de entrega                |
| `deletedAt`            | `Date`               | ❌          | Data de exclusão (soft delete) |
| `notes`                | `string`             | ❌          | Notas internas                 |
| `isActive`             | `boolean`            | ✅          | Ativo (default: true)          |

#### **Financeiro**

| Campo               | Tipo              | Obrigatório | Descrição              |
| ------------------- | ----------------- | ----------- | ---------------------- |
| `financial`         | `FinancialStatus` | ✅          | Status financeiro      |
| `paymentMethod`     | `PaymentMethod`   | ❌          | Forma de pagamento     |
| `paymentConditions` | `string`          | ❌          | Condições de pagamento |
| `servicesSum`       | `Decimal128`      | ✅          | Soma dos serviços      |
| `totalDiscount`     | `Decimal128`      | ✅          | Desconto total         |
| `totalAddition`     | `Decimal128`      | ✅          | Acréscimo total        |
| `totalAmountPaid`   | `Decimal128`      | ✅          | Valor pago             |
| `totalAmountLeft`   | `Decimal128`      | ✅          | Valor restante         |

#### **Notas Fiscais**

| Campo             | Tipo     | Obrigatório | Descrição               |
| ----------------- | -------- | ----------- | ----------------------- |
| `serviceInvoice`  | `string` | ❌          | Nota fiscal de serviços |
| `saleInvoice`     | `string` | ❌          | Nota fiscal de venda    |
| `shippingInvoice` | `string` | ❌          | Nota fiscal de remessa  |

#### **Integração com Faturas (Futuro)**

| Campo              | Tipo          | Obrigatório | Descrição               |
| ------------------ | ------------- | ----------- | ----------------------- |
| `invoiceId`        | `string`      | ❌          | ID da fatura principal  |
| `invoiceItemIds`   | `string[]`    | ❌          | IDs dos itens de fatura |
| `paymentType`      | `PaymentType` | ✅          | Tipo de pagamento       |
| `installmentCount` | `number`      | ✅          | Número de parcelas      |
| `paidInstallments` | `number`      | ✅          | Parcelas pagas          |

### **2. ServiceItem (Serviço Executado)**

#### **Campos**

| Campo         | Tipo         | Obrigatório | Descrição            |
| ------------- | ------------ | ----------- | -------------------- |
| `description` | `string`     | ✅          | Descrição do serviço |
| `quantity`    | `number`     | ✅          | Quantidade (min: 1)  |
| `value`       | `Decimal128` | ✅          | Valor unitário       |
| `discount`    | `Decimal128` | ❌          | Desconto             |
| `addition`    | `Decimal128` | ❌          | Acréscimo            |
| `total`       | `Decimal128` | ❌          | Total (calculado)    |

### **3. Invoice (Fatura - Futuro)**

#### **Campos Principais**

| Campo             | Tipo            | Obrigatório | Descrição              |
| ----------------- | --------------- | ----------- | ---------------------- |
| `invoiceNumber`   | `string`        | ✅          | Número da fatura       |
| `serviceOrderId`  | `string`        | ✅          | ID da ordem de serviço |
| `customerId`      | `string`        | ✅          | ID do cliente          |
| `totalAmount`     | `Decimal128`    | ✅          | Valor total            |
| `status`          | `InvoiceStatus` | ✅          | Status da fatura       |
| `issueDate`       | `Date`          | ✅          | Data de emissão        |
| `dueDate`         | `Date`          | ❌          | Data de vencimento     |
| `paidAmount`      | `Decimal128`    | ✅          | Valor pago             |
| `remainingAmount` | `Decimal128`    | ✅          | Valor restante         |

### **4. InvoiceItem (Item da Fatura - Futuro)**

#### **Campos**

| Campo               | Tipo                | Obrigatório | Descrição              |
| ------------------- | ------------------- | ----------- | ---------------------- |
| `serviceOrderId`    | `string`            | ✅          | ID da ordem de serviço |
| `description`       | `string`            | ✅          | Descrição              |
| `amount`            | `Decimal128`        | ✅          | Valor da parcela       |
| `dueDate`           | `Date`              | ✅          | Data de vencimento     |
| `installmentNumber` | `number`            | ✅          | Número da parcela      |
| `status`            | `InvoiceItemStatus` | ✅          | Status da parcela      |
| `paidAmount`        | `Decimal128`        | ✅          | Valor pago             |

### **5. Counter (Contador de Sequência)**

#### **Campos**

| Campo            | Tipo     | Obrigatório | Descrição          |
| ---------------- | -------- | ----------- | ------------------ |
| `sequence_value` | `number` | ✅          | Valor da sequência |

## 🔢 Enums

### **ServiceOrderStatus**

```typescript
enum ServiceOrderStatus {
  CONFIRMAR = 'confirmar', // Aguardando confirmação
  APROVADO = 'aprovado', // Aprovado para execução
  PRONTO = 'pronto', // Pronto para entrega
  ENTREGUE = 'entregue', // Entregue ao cliente
  REPROVADO = 'reprovado', // Reprovado
}
```

### **FinancialStatus**

```typescript
enum FinancialStatus {
  EM_ABERTO = 'em_aberto', // Em aberto
  PAGO = 'pago', // Totalmente pago
  PARCIALMENTE_PAGO = 'parcialmente_pago', // Parcialmente pago
  DEVE = 'deve', // Deve
  FATURADO = 'faturado', // Faturado
  VENCIDO = 'vencido', // Vencido
  CANCELADO = 'cancelado', // Cancelado
}
```

### **PaymentMethod**

```typescript
enum PaymentMethod {
  DEBITO = 'débito', // Débito
  CREDITO = 'credito', // Crédito
  DINHEIRO = 'dinheiro', // Dinheiro
  PIX = 'pix', // PIX
  BOLETO = 'boleto', // Boleto
}
```

### **PaymentType**

```typescript
enum PaymentType {
  CASH = 'CASH', // À vista
  INSTALLMENT = 'INSTALLMENT', // Parcelado
  PENDING = 'PENDING', // Pendente
}
```

### **InvoiceStatus (Futuro)**

```typescript
enum InvoiceStatus {
  PENDING = 'PENDING', // Pendente
  PARTIAL = 'PARTIAL', // Parcial
  PAID = 'PAID', // Pago
  OVERDUE = 'OVERDUE', // Vencido
  CANCELLED = 'CANCELLED', // Cancelado
}
```

### **InvoiceItemStatus (Futuro)**

```typescript
enum InvoiceItemStatus {
  PENDING = 'PENDING', // Pendente
  PAID = 'PAID', // Pago
  OVERDUE = 'OVERDUE', // Vencido
}
```

## 🔗 Interfaces TypeScript

### **IServiceOrder**

```typescript
interface IServiceOrder {
  id: string;
  orderNumber: number;
  customerId: string;
  equipment: string;
  model?: string;
  brand?: string;
  serialNumber?: string;
  voltage?: string;
  accessories?: string;
  customerObservations?: string;
  reportedDefect?: string;
  warranty?: boolean;
  isReturn?: boolean;
  status: ServiceOrderStatus;
  entryDate: Date;
  approvalDate?: Date;
  expectedDeliveryDate?: Date;
  deliveryDate?: Date;
  deletedAt?: Date;
  notes?: string;
  financial: FinancialStatus;
  paymentMethod?: PaymentMethod;
  paymentConditions?: string;
  serviceInvoice?: string;
  saleInvoice?: string;
  shippingInvoice?: string;
  services: IServiceItem[];
  servicesSum: Types.Decimal128;
  totalDiscount: Types.Decimal128;
  totalAddition: Types.Decimal128;
  totalAmountPaid: Types.Decimal128;
  totalAmountLeft: Types.Decimal128;
  // Campos de integração
  invoiceId?: string;
  invoiceItemIds?: string[];
  paymentType: PaymentType;
  installmentCount: number;
  paidInstallments: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### **IServiceItem**

```typescript
interface IServiceItem {
  description: string;
  quantity: number;
  value: Types.Decimal128;
  discount: Types.Decimal128;
  addition: Types.Decimal128;
  total: Types.Decimal128;
}
```

### **ICreateServiceOrder**

```typescript
interface ICreateServiceOrder {
  customerId: string;
  equipment: string;
  model?: string;
  brand?: string;
  serialNumber?: string;
  voltage?: string;
  accessories?: string;
  customerObservations?: string;
  warranty?: boolean;
  isReturn?: boolean;
  expectedDeliveryDate?: Date;
  notes?: string;
  paymentMethod?: PaymentMethod;
  paymentConditions?: string;
  services?: IServiceItem[];
  totalDiscount?: Types.Decimal128;
  totalAddition?: Types.Decimal128;
  // Campos de integração
  invoiceId?: string;
  invoiceItemIds?: string[];
  paymentType?: PaymentType;
  installmentCount?: number;
  paidInstallments?: number;
}
```

### **IUpdateServiceOrder**

```typescript
interface IUpdateServiceOrder {
  equipment?: string;
  model?: string;
  brand?: string;
  serialNumber?: string;
  voltage?: string;
  accessories?: string;
  customerObservations?: string;
  warranty?: boolean;
  isReturn?: boolean;
  status?: ServiceOrderStatus;
  approvalDate?: Date;
  expectedDeliveryDate?: Date;
  deliveryDate?: Date;
  notes?: string;
  financial?: FinancialStatus;
  paymentMethod?: PaymentMethod;
  paymentConditions?: string;
  serviceInvoice?: string;
  saleInvoice?: string;
  shippingInvoice?: string;
  services?: IServiceItem[];
  totalDiscount?: Types.Decimal128;
  totalAddition?: Types.Decimal128;
  totalAmountPaid?: Types.Decimal128;
  totalAmountLeft?: Types.Decimal128;
  // Campos de integração
  invoiceId?: string;
  invoiceItemIds?: string[];
  paymentType?: PaymentType;
  installmentCount?: number;
  paidInstallments?: number;
}
```

## 📈 Fluxo de Status

### **Status da Ordem de Serviço**

```
CONFIRMAR → APROVADO → PRONTO → ENTREGUE
    ↓
REPROVADO
```

### **Status Financeiro**

```
EM_ABERTO → FATURADO → PARCIALMENTE_PAGO → PAGO
    ↓
VENCIDO
    ↓
CANCELADO
```

## 💰 Cálculos Financeiros

### **ServiceItem Total**

```typescript
total = value * quantity + addition - discount;
```

### **ServiceOrder Totals**

```typescript
servicesSum = sum(serviceItem.total);
totalAmount = servicesSum + totalAddition - totalDiscount;
totalAmountLeft = totalAmount - totalAmountPaid;
```

## 🔍 Índices de Performance

### **ServiceOrder**

```typescript
// Índices principais
{ orderNumber: 1 } // Único
{ customerId: 1 }
{ status: 1 }
{ entryDate: -1 }
{ isActive: 1, deletedAt: 1 }
{ financial: 1 }
{ serialNumber: 1 }
{ createdAt: -1 }
```

## 🚀 Endpoints Sugeridos

### **CRUD Básico**

```
GET    /service-orders           # Listar ordens
POST   /service-orders           # Criar ordem
GET    /service-orders/:id       # Buscar por ID
PUT    /service-orders/:id       # Atualizar ordem
DELETE /service-orders/:id       # Excluir ordem (soft delete)
```

### **Busca Específica**

```
GET    /service-orders/number/:orderNumber  # Buscar por número
GET    /service-orders/customer/:customerId # Buscar por cliente
GET    /service-orders/status/:status       # Buscar por status
GET    /service-orders/financial/:financial # Buscar por status financeiro
```

### **Integração com Faturas (Futuro)**

```
POST   /service-orders/with-installments    # Criar com parcelas
PUT    /service-orders/:id/payment          # Atualizar pagamento
GET    /service-orders/:id/invoices         # Buscar faturas
```

## 🎨 Guia para Frontend

### **Formulário de Criação**

```typescript
interface CreateServiceOrderForm {
  // Dados do cliente
  customerId: string;

  // Dados do equipamento
  equipment: string;
  model?: string;
  brand?: string;
  serialNumber?: string;
  voltage?: string;
  accessories?: string;

  // Observações
  customerObservations?: string;
  reportedDefect?: string;
  notes?: string;

  // Configurações
  warranty: boolean;
  isReturn: boolean;
  expectedDeliveryDate?: Date;

  // Financeiro
  paymentMethod?: PaymentMethod;
  paymentConditions?: string;
  totalDiscount?: number;
  totalAddition?: number;

  // Serviços
  services: ServiceItemForm[];
}

interface ServiceItemForm {
  description: string;
  quantity: number;
  value: number;
  discount?: number;
  addition?: number;
}
```

### **Formulário de Atualização**

```typescript
interface UpdateServiceOrderForm {
  // Dados do equipamento
  equipment?: string;
  model?: string;
  brand?: string;
  serialNumber?: string;
  voltage?: string;
  accessories?: string;

  // Observações
  customerObservations?: string;
  reportedDefect?: string;
  notes?: string;

  // Status
  status?: ServiceOrderStatus;
  approvalDate?: Date;
  expectedDeliveryDate?: Date;
  deliveryDate?: Date;

  // Financeiro
  financial?: FinancialStatus;
  paymentMethod?: PaymentMethod;
  paymentConditions?: string;
  totalDiscount?: number;
  totalAddition?: number;
  totalAmountPaid?: number;

  // Serviços
  services?: ServiceItemForm[];
}
```

### **Componentes Sugeridos**

- **ServiceOrderList**: Lista de ordens com filtros
- **ServiceOrderForm**: Formulário de criação/edição
- **ServiceOrderDetails**: Detalhes da ordem
- **ServiceItemList**: Lista de serviços
- **ServiceItemForm**: Formulário de serviço
- **FinancialStatus**: Status financeiro
- **PaymentInfo**: Informações de pagamento

### **Estados da Interface**

```typescript
interface ServiceOrderState {
  orders: IServiceOrder[];
  currentOrder: IServiceOrder | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: ServiceOrderStatus;
    financial?: FinancialStatus;
    customerId?: string;
    dateRange?: { start: Date; end: Date };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

## 🔧 Validações de Negócio

### **ServiceOrder**

- `orderNumber` deve ser único
- `customerId` deve existir
- `equipment` é obrigatório
- `entryDate` é obrigatório
- `approvalDate` só pode ser preenchida se `status = 'aprovado'`
- `deliveryDate` só pode ser preenchida se `status = 'entregue'`

### **ServiceItem**

- `description` é obrigatório
- `quantity` deve ser >= 1
- `value` deve ser >= 0
- `discount` deve ser >= 0
- `addition` deve ser >= 0
- `total` é calculado automaticamente

### **Financeiro**

- `totalAmountPaid` + `totalAmountLeft` = `totalAmount`
- `paidInstallments` <= `installmentCount`
- `totalAmountLeft` >= 0

## 📊 Relatórios Sugeridos

### **Relatórios de Ordem**

- Ordens por período
- Ordens por status
- Ordens por cliente
- Performance de entrega

### **Relatórios Financeiros**

- Faturamento por período
- Status de pagamento
- Inadimplência
- Recebimentos

### **Relatórios de Equipamento**

- Equipamentos mais atendidos
- Problemas recorrentes
- Tempo médio de reparo

## 🚀 Próximos Passos

1. **Implementar módulo de ordens de serviço**
2. **Criar módulo de faturas**
3. **Implementar integração entre módulos**
4. **Adicionar relatórios**
5. **Criar dashboard**
6. **Implementar notificações**
7. **Adicionar auditoria**

---

**📝 Nota**: Esta documentação é um guia completo para implementação. Mantenha-a atualizada conforme o sistema evolui.
