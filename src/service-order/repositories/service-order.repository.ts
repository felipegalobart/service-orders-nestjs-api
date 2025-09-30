import {
  IServiceOrder,
  ICreateServiceOrder,
  IUpdateServiceOrder,
  ServiceOrderStatus,
  FinancialStatus,
  PaymentType,
} from '../schemas/service-order.schema';

// Interface de filtros
export interface IServiceOrderFilters {
  status?: ServiceOrderStatus;
  financial?: FinancialStatus;
  customerId?: string;
  paymentType?: PaymentType;
  isActive?: boolean;
  // Filtros de equipamento
  equipment?: string;
  model?: string;
  brand?: string;
  serialNumber?: string;
  // Filtros de cliente
  customerName?: string;
  customerCorporateName?: string;
  customerTradeName?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Interface de resultado paginado
export interface IPaginatedResult {
  data: IServiceOrder[];
  total: number;
  page: number;
  limit: number;
}

// Interface do repository
export interface IServiceOrderRepository {
  // CRUD básico
  create(serviceOrderData: ICreateServiceOrder): Promise<IServiceOrder>;
  findById(id: string): Promise<IServiceOrder | null>;
  findAll(
    page?: number,
    limit?: number,
    filters?: IServiceOrderFilters,
  ): Promise<IPaginatedResult>;
  update(
    id: string,
    serviceOrderData: IUpdateServiceOrder,
  ): Promise<IServiceOrder | null>;
  delete(id: string): Promise<IServiceOrder | null>;

  // Busca específica
  findByOrderNumber(orderNumber: number): Promise<IServiceOrder | null>;
  findByCustomerId(customerId: string): Promise<IServiceOrder[]>;
  findByStatus(status: ServiceOrderStatus): Promise<IServiceOrder[]>;
  findByFinancialStatus(financial: FinancialStatus): Promise<IServiceOrder[]>;

  // Busca por equipamento
  findByEquipment(equipment: string): Promise<IServiceOrder[]>;
  findByModel(model: string): Promise<IServiceOrder[]>;
  findByBrand(brand: string): Promise<IServiceOrder[]>;
  findBySerialNumber(serialNumber: string): Promise<IServiceOrder | null>;

  // Busca por cliente
  findByCustomerName(customerName: string): Promise<IServiceOrder[]>;
  findByCustomerCorporateName(corporateName: string): Promise<IServiceOrder[]>;
  findByCustomerTradeName(tradeName: string): Promise<IServiceOrder[]>;

  // Busca combinada
  findByEquipmentAndModel(
    equipment: string,
    model: string,
  ): Promise<IServiceOrder[]>;
  findByBrandAndModel(brand: string, model: string): Promise<IServiceOrder[]>;
  findByCustomerNameAndStatus(
    customerName: string,
    status: ServiceOrderStatus,
  ): Promise<IServiceOrder[]>;
  findByCustomerAndEquipment(
    customerName: string,
    equipment: string,
  ): Promise<IServiceOrder[]>;

  // Busca avançada
  search(
    searchTerm: string,
    page?: number,
    limit?: number,
  ): Promise<IPaginatedResult>;
  searchEquipment(searchTerm: string): Promise<IServiceOrder[]>;
  searchByCustomer(searchTerm: string): Promise<IServiceOrder[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<IServiceOrder[]>;

  // Busca com paginação
  findByEquipmentPaginated(
    equipment: string,
    page: number,
    limit: number,
  ): Promise<IPaginatedResult>;
  findByCustomerIdPaginated(
    customerId: string,
    page: number,
    limit: number,
  ): Promise<IPaginatedResult>;
  findByCustomerNamePaginated(
    customerName: string,
    page: number,
    limit: number,
  ): Promise<IPaginatedResult>;
}
