# Guia de Implementação Frontend - Service Orders API

## 📋 Informações do Projeto

**API Base URL:** `http://localhost:3000`  
**Módulo:** Service Orders  
**Autenticação:** JWT Bearer Token  
**Documentação:** Completa com exemplos práticos

## 🚀 Como Implementar

### 1. **Configuração Inicial**

#### **Instalar Dependências**

```bash
npm install axios react-router-dom
npm install -D @types/react @types/react-dom typescript
```

#### **Configurar Variáveis de Ambiente**

```bash
# .env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=10000
```

### 2. **Estrutura de Arquivos**

```
src/
├── services/
│   ├── api.ts
│   └── serviceOrderService.ts
├── hooks/
│   ├── useServiceOrders.ts
│   └── useServiceOrder.ts
├── types/
│   └── serviceOrder.ts
├── components/
│   └── ServiceOrders/
│       ├── ServiceOrderList.tsx
│       ├── ServiceOrderForm.tsx
│       └── ServiceOrderDetails.tsx
└── utils/
    ├── formatters.ts
    └── validators.ts
```

### 3. **Configuração da API**

#### **services/api.ts**

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

### 4. **Tipos TypeScript**

#### **types/serviceOrder.ts**

```typescript
export interface ServiceOrder {
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
  warranty: boolean;
  isReturn: boolean;
  status: ServiceOrderStatus;
  entryDate: string;
  deliveryDate?: string;
  notes?: string;
  financial: FinancialStatus;
  invoiceItemIds: string[];
  paymentType: PaymentType;
  installmentCount: number;
  paidInstallments: number;
  servicesSum: number;
  totalDiscount: number;
  totalAddition: number;
  totalAmountPaid: number;
  totalAmountLeft: number;
  isActive: boolean;
  services: ServiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  description: string;
  quantity: number;
  value: number;
  discount: number;
  addition: number;
  total: number;
}

export interface CreateServiceOrderRequest {
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
  entryDate?: string;
  deliveryDate?: string;
  notes?: string;
  financial?: FinancialStatus;
  paymentType?: PaymentType;
  installmentCount?: number;
  services?: Omit<ServiceItem, 'total'>[];
}

export interface ServiceOrderFilters {
  page?: number;
  limit?: number;
  status?: ServiceOrderStatus;
  financial?: FinancialStatus;
  customerId?: string;
  equipment?: string;
  model?: string;
  brand?: string;
  serialNumber?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export enum ServiceOrderStatus {
  CONFIRMAR = 'confirmar',
  APROVADO = 'aprovado',
  PRONTO = 'pronto',
  ENTREGUE = 'entregue',
  REPROVADO = 'reprovado',
}

export enum FinancialStatus {
  EM_ABERTO = 'em_aberto',
  PAGO = 'pago',
  PARCIALMENTE_PAGO = 'parcialmente_pago',
  DEVE = 'deve',
  FATURADO = 'faturado',
  VENCIDO = 'vencido',
  CANCELADO = 'cancelado',
}

export enum PaymentType {
  CASH = 'cash',
  INSTALLMENT = 'installment',
  STORE_CREDIT = 'store_credit',
}
```

### 5. **Serviço de API**

#### **services/serviceOrderService.ts**

```typescript
import { api } from './api';
import {
  ServiceOrder,
  CreateServiceOrderRequest,
  UpdateServiceOrderRequest,
  ServiceOrderFilters,
  PaginatedResult,
  ServiceOrderStatus,
  FinancialStatus,
} from '../types/serviceOrder';

export const serviceOrderService = {
  // CRUD básico
  async create(data: CreateServiceOrderRequest): Promise<ServiceOrder> {
    const response = await api.post('/service-orders', data);
    return response.data;
  },

  async findAll(
    filters?: ServiceOrderFilters,
  ): Promise<PaginatedResult<ServiceOrder>> {
    const response = await api.get('/service-orders', { params: filters });
    return response.data;
  },

  async findById(id: string): Promise<ServiceOrder> {
    const response = await api.get(`/service-orders/${id}`);
    return response.data;
  },

  async update(
    id: string,
    data: UpdateServiceOrderRequest,
  ): Promise<ServiceOrder> {
    const response = await api.put(`/service-orders/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/service-orders/${id}`);
  },

  // Buscas específicas
  async findByOrderNumber(orderNumber: number): Promise<ServiceOrder[]> {
    const response = await api.get(
      `/service-orders/by-order-number?q=${orderNumber}`,
    );
    return response.data;
  },

  async findByCustomer(customerId: string): Promise<ServiceOrder[]> {
    const response = await api.get(
      `/service-orders/by-customer?customerId=${customerId}`,
    );
    return response.data;
  },

  async findByStatus(status: ServiceOrderStatus): Promise<ServiceOrder[]> {
    const response = await api.get(`/service-orders/by-status?q=${status}`);
    return response.data;
  },

  async findByEquipment(equipment: string): Promise<ServiceOrder[]> {
    const response = await api.get(
      `/service-orders/by-equipment?q=${equipment}`,
    );
    return response.data;
  },

  async findByBrand(brand: string): Promise<ServiceOrder[]> {
    const response = await api.get(`/service-orders/by-brand?q=${brand}`);
    return response.data;
  },

  async findBySerialNumber(serialNumber: string): Promise<ServiceOrder[]> {
    const response = await api.get(
      `/service-orders/by-serial-number?q=${serialNumber}`,
    );
    return response.data;
  },

  async findByCustomerName(customerName: string): Promise<ServiceOrder[]> {
    const response = await api.get(
      `/service-orders/by-customer-name?q=${customerName}`,
    );
    return response.data;
  },

  async search(term: string): Promise<ServiceOrder[]> {
    const response = await api.get(`/service-orders/search?q=${term}`);
    return response.data;
  },

  // Gestão de status
  async updateStatus(
    id: string,
    status: ServiceOrderStatus,
  ): Promise<ServiceOrder> {
    const response = await api.put(`/service-orders/${id}/status`, { status });
    return response.data;
  },

  async updateFinancialStatus(
    id: string,
    financial: FinancialStatus,
  ): Promise<ServiceOrder> {
    const response = await api.put(`/service-orders/${id}/financial-status`, {
      financial,
    });
    return response.data;
  },

  // Sequência numérica
  async getCurrentSequenceNumber(): Promise<number> {
    const response = await api.get('/service-orders/sequence/current');
    return response.data.currentNumber;
  },

  async getSequenceInfo(): Promise<{ currentNumber: number; exists: boolean }> {
    const response = await api.get('/service-orders/sequence/info');
    return response.data;
  },
};
```

### 6. **Hooks Customizados**

#### **hooks/useServiceOrders.ts**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { serviceOrderService } from '../services/serviceOrderService';
import {
  ServiceOrder,
  ServiceOrderFilters,
  PaginatedResult,
} from '../types/serviceOrder';

export const useServiceOrders = (initialFilters?: ServiceOrderFilters) => {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  const fetchOrders = useCallback(async (filters?: ServiceOrderFilters) => {
    setLoading(true);
    setError(null);

    try {
      const result = await serviceOrderService.findAll(filters);
      setOrders(result.data);
      setPagination({
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar ordens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(initialFilters);
  }, [fetchOrders, initialFilters]);

  const refetch = useCallback(() => {
    fetchOrders(initialFilters);
  }, [fetchOrders, initialFilters]);

  return {
    orders,
    loading,
    error,
    pagination,
    refetch,
  };
};
```

#### **hooks/useServiceOrder.ts**

```typescript
import { useState, useEffect } from 'react';
import { serviceOrderService } from '../services/serviceOrderService';
import { ServiceOrder } from '../types/serviceOrder';

export const useServiceOrder = (id: string) => {
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await serviceOrderService.findById(id);
      setOrder(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar ordem');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateOrder = async (data: Partial<ServiceOrder>) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await serviceOrderService.update(id, data);
      setOrder(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar ordem');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      await serviceOrderService.delete(id);
      setOrder(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir ordem');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    loading,
    error,
    updateOrder,
    deleteOrder,
    refetch: fetchOrder,
  };
};
```

### 7. **Utilitários**

#### **utils/formatters.ts**

```typescript
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('pt-BR');
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('pt-BR');
};

export const formatStatus = (status: string): string => {
  const statusMap = {
    confirmar: 'Aguardando Confirmação',
    aprovado: 'Aprovado',
    pronto: 'Pronto',
    entregue: 'Entregue',
    reprovado: 'Reprovado',
    em_aberto: 'Em Aberto',
    pago: 'Pago',
    parcialmente_pago: 'Parcialmente Pago',
    deve: 'Deve',
    faturado: 'Faturado',
    vencido: 'Vencido',
    cancelado: 'Cancelado',
  };
  return statusMap[status] || status;
};
```

#### **utils/validators.ts**

```typescript
export const validateServiceOrder = (data: any): string[] => {
  const errors: string[] = [];

  if (!data.customerId) {
    errors.push('ID do cliente é obrigatório');
  }

  if (!data.equipment) {
    errors.push('Equipamento é obrigatório');
  }

  if (data.services && data.services.length > 0) {
    data.services.forEach((service: any, index: number) => {
      if (!service.description) {
        errors.push(`Descrição do serviço ${index + 1} é obrigatória`);
      }
      if (!service.quantity || service.quantity < 1) {
        errors.push(`Quantidade do serviço ${index + 1} deve ser maior que 0`);
      }
      if (!service.value || service.value < 0) {
        errors.push(
          `Valor do serviço ${index + 1} deve ser maior ou igual a 0`,
        );
      }
    });
  }

  return errors;
};
```

### 8. **Componente de Lista**

#### **components/ServiceOrders/ServiceOrderList.tsx**

```typescript
import React from 'react';
import { ServiceOrder } from '../../types/serviceOrder';
import { formatCurrency, formatDate, formatStatus } from '../../utils/formatters';

interface ServiceOrderListProps {
  orders: ServiceOrder[];
  loading: boolean;
  error: string | null;
  onOrderSelect: (order: ServiceOrder) => void;
}

export const ServiceOrderList: React.FC<ServiceOrderListProps> = ({
  orders,
  loading,
  error,
  onOrderSelect,
}) => {
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="service-order-list">
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Equipamento</th>
              <th>Status</th>
              <th>Financeiro</th>
              <th>Valor</th>
              <th>Data Entrada</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerId}</td>
                <td>{order.equipment}</td>
                <td>
                  <span className={`badge badge-${getStatusColor(order.status)}`}>
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${getFinancialStatusColor(order.financial)}`}>
                    {formatStatus(order.financial)}
                  </span>
                </td>
                <td>{formatCurrency(order.totalAmountLeft)}</td>
                <td>{formatDate(order.entryDate)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => onOrderSelect(order)}
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusColor = (status: string): string => {
  const colors = {
    confirmar: 'warning',
    aprovado: 'info',
    pronto: 'success',
    entregue: 'primary',
    reprovado: 'danger',
  };
  return colors[status] || 'secondary';
};

const getFinancialStatusColor = (status: string): string => {
  const colors = {
    em_aberto: 'warning',
    pago: 'success',
    parcialmente_pago: 'info',
    deve: 'danger',
    faturado: 'primary',
    vencido: 'danger',
    cancelado: 'secondary',
  };
  return colors[status] || 'secondary';
};
```

### 9. **Exemplo de Uso Completo**

#### **pages/ServiceOrdersPage.tsx**

```typescript
import React, { useState } from 'react';
import { useServiceOrders } from '../hooks/useServiceOrders';
import { ServiceOrderList } from '../components/ServiceOrders/ServiceOrderList';
import { ServiceOrder } from '../types/serviceOrder';

const ServiceOrdersPage: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
  });
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null);

  const { orders, loading, error, refetch } = useServiceOrders(filters);

  const handleOrderSelect = (order: ServiceOrder) => {
    setSelectedOrder(order);
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  if (selectedOrder) {
    return (
      <div className="container">
        <h2>Detalhes da Ordem #{selectedOrder.orderNumber}</h2>
        <div className="order-details">
          <p><strong>Equipamento:</strong> {selectedOrder.equipment}</p>
          <p><strong>Status:</strong> {selectedOrder.status}</p>
          <p><strong>Financeiro:</strong> {selectedOrder.financial}</p>
          <p><strong>Valor Total:</strong> R$ {selectedOrder.totalAmountLeft}</p>
          <button onClick={handleBackToList} className="btn btn-secondary">
            Voltar à Lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Ordens de Serviço</h2>
        <button className="btn btn-primary" onClick={() => refetch()}>
          Atualizar
        </button>
      </div>

      <ServiceOrderList
        orders={orders}
        loading={loading}
        error={error}
        onOrderSelect={handleOrderSelect}
      />
    </div>
  );
};

export default ServiceOrdersPage;
```

## 🔧 Configuração do Projeto

### **package.json**

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "react-router-dom": "^6.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

### **vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

## 📚 Endpoints Disponíveis

### **CRUD Básico**

- `POST /service-orders` - Criar ordem
- `GET /service-orders` - Listar ordens
- `GET /service-orders/:id` - Buscar por ID
- `PUT /service-orders/:id` - Atualizar ordem
- `DELETE /service-orders/:id` - Excluir ordem

### **Buscas Específicas**

- `GET /service-orders/by-order-number?q=123` - Por número
- `GET /service-orders/by-customer?customerId=xxx` - Por cliente
- `GET /service-orders/by-status?q=confirmar` - Por status
- `GET /service-orders/by-equipment?q=Notebook` - Por equipamento
- `GET /service-orders/by-brand?q=Dell` - Por marca
- `GET /service-orders/by-serial-number?q=DL123` - Por série
- `GET /service-orders/by-customer-name?q=João` - Por nome do cliente
- `GET /service-orders/search?q=termo` - Busca geral

### **Gestão de Status**

- `PUT /service-orders/:id/status` - Atualizar status técnico
- `PUT /service-orders/:id/financial-status` - Atualizar status financeiro

### **Sequência Numérica**

- `GET /service-orders/sequence/current` - Número atual
- `GET /service-orders/sequence/info` - Informações da sequência

## 🚨 Validações Importantes

### **Campos Obrigatórios**

- `customerId` - ID do cliente (deve existir no banco)
- `equipment` - Descrição do equipamento

### **Validações de Negócio**

- Cliente deve existir no banco de dados
- Datas de entrega não podem ser anteriores à data de entrada
- Valores financeiros devem ser positivos
- Quantidade de serviços deve ser maior que 0

## 🔐 Autenticação

### **Obter Token**

```javascript
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'cursor_user@teste.com',
    password: '123456',
  }),
});

const { access_token } = await response.json();
localStorage.setItem('authToken', access_token);
```

### **Usar Token**

```javascript
const token = localStorage.getItem('authToken');
const response = await fetch('http://localhost:3000/service-orders', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## 📝 Exemplo de Dados

### **Criar Ordem de Serviço**

```json
{
  "customerId": "68d99ab33a6a2248cbc0a1f5",
  "equipment": "Notebook Dell Inspiron 15",
  "model": "Inspiron 15 3000",
  "brand": "Dell",
  "serialNumber": "DL123456789",
  "customerObservations": "Notebook não liga",
  "reportedDefect": "Falha na fonte de alimentação",
  "warranty": true,
  "services": [
    {
      "description": "Diagnóstico completo",
      "quantity": 1,
      "value": 80,
      "discount": 0,
      "addition": 0
    }
  ]
}
```

### **Resposta da API**

```json
{
  "id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "orderNumber": 123,
  "customerId": "68d99ab33a6a2248cbc0a1f5",
  "equipment": "Notebook Dell Inspiron 15",
  "status": "confirmar",
  "financial": "em_aberto",
  "servicesSum": 80,
  "totalAmountLeft": 80,
  "createdAt": "2025-09-30T19:38:56.295Z",
  "updatedAt": "2025-09-30T19:38:56.295Z"
}
```

## 🎯 Próximos Passos

1. **Implementar os componentes** seguindo a estrutura fornecida
2. **Configurar o roteamento** com React Router
3. **Adicionar validações** de formulário
4. **Implementar paginação** e filtros
5. **Adicionar testes** unitários
6. **Configurar build** e deploy

## 📞 Suporte

- **API funcionando** em `http://localhost:3000`
- **Documentação completa** disponível
- **Exemplos práticos** incluídos
- **Coleção Postman** para testes

Este guia fornece tudo que você precisa para implementar o frontend da API de Service Orders!
