import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

// Enums
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

export enum PaymentMethod {
  DEBITO = 'débito',
  CREDITO = 'credito',
  DINHEIRO = 'dinheiro',
  PIX = 'pix',
  BOLETO = 'boleto',
}

export enum PaymentType {
  CASH = 'CASH',
  INSTALLMENT = 'INSTALLMENT',
  PENDING = 'PENDING',
}

// Schema de serviços (subdocumento)
@Schema({ _id: false })
export class ServiceItem {
  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true, min: 1, default: 1 })
  quantity: number;

  @Prop({
    type: Types.Decimal128,
    required: true,
    default: Types.Decimal128.fromString('0'),
  })
  value: Types.Decimal128;

  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  discount: Types.Decimal128;

  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  addition: Types.Decimal128;

  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  total: Types.Decimal128;
}

export const ServiceItemSchema = SchemaFactory.createForClass(ServiceItem);

// Schema principal - ServiceOrder
export type ServiceOrderDocument = HydratedDocument<ServiceOrder>;

@Schema({ timestamps: true })
export class ServiceOrder {
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ type: Number, unique: true, required: true })
  orderNumber: number;

  @Prop({ type: String, required: true })
  customerId: string;

  // Equipamento (campos simples)
  @Prop({ type: String, required: true })
  equipment: string;

  @Prop({ type: String })
  model?: string;

  @Prop({ type: String })
  brand?: string;

  @Prop({ type: String })
  serialNumber?: string;

  @Prop({ type: String }) // Texto livre
  voltage?: string;

  @Prop({ type: String }) // Texto livre
  accessories?: string;

  @Prop({ type: String })
  customerObservations?: string;

  @Prop({ type: String })
  reportedDefect?: string; // Defeito reclamado

  @Prop({ type: Boolean, default: false })
  warranty?: boolean;

  @Prop({ type: Boolean, default: false })
  isReturn?: boolean;

  @Prop({
    type: String,
    enum: ServiceOrderStatus,
    default: ServiceOrderStatus.CONFIRMAR,
  })
  status: ServiceOrderStatus;

  // Datas
  @Prop({ type: Date, required: true, default: new Date() })
  entryDate: Date;

  @Prop({ type: Date })
  approvalDate?: Date;

  @Prop({ type: Date })
  expectedDeliveryDate?: Date;

  @Prop({ type: Date })
  deliveryDate?: Date;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: String })
  notes?: string;

  // Financeiro
  @Prop({
    type: String,
    enum: FinancialStatus,
    default: FinancialStatus.EM_ABERTO,
  })
  financial: FinancialStatus;

  // Campos para integração futura com módulo de faturas
  @Prop({ type: String })
  invoiceId?: string; // ID da fatura principal

  @Prop({ type: [String], default: [] })
  invoiceItemIds?: string[]; // IDs dos itens de fatura

  @Prop({
    type: String,
    enum: PaymentType,
    default: PaymentType.CASH,
  })
  paymentType: PaymentType;

  @Prop({ type: Number, default: 1 })
  installmentCount: number; // Número de parcelas

  @Prop({ type: Number, default: 0 })
  paidInstallments: number; // Parcelas pagas

  @Prop({
    type: String,
    enum: PaymentMethod,
  })
  paymentMethod?: PaymentMethod;

  @Prop({ type: String }) // Texto livre
  paymentConditions?: string;

  // Notas Fiscais (apenas números)
  @Prop({ type: String })
  serviceInvoice?: string;

  @Prop({ type: String })
  saleInvoice?: string;

  @Prop({ type: String })
  shippingInvoice?: string;

  // Serviços executados
  @Prop({ type: [ServiceItemSchema], default: [] })
  services: ServiceItem[];

  // Valores calculados
  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  servicesSum: Types.Decimal128;

  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  totalDiscount: Types.Decimal128;

  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  totalAddition: Types.Decimal128;

  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  totalAmountPaid: Types.Decimal128;

  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  totalAmountLeft: Types.Decimal128;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export const ServiceOrderSchema = SchemaFactory.createForClass(ServiceOrder);

// Índices para performance
ServiceOrderSchema.index({ orderNumber: 1 }, { unique: true });
ServiceOrderSchema.index({ customerId: 1 });
ServiceOrderSchema.index({ status: 1 });
ServiceOrderSchema.index({ entryDate: -1 });
ServiceOrderSchema.index({ isActive: 1, deletedAt: 1 });
ServiceOrderSchema.index({ financial: 1 });
ServiceOrderSchema.index({ serialNumber: 1 });
ServiceOrderSchema.index({ createdAt: -1 });

// Schema do Counter para sequência
export type CounterDocument = HydratedDocument<Counter>;

@Schema({ collection: 'counters' })
export class Counter {
  _id: string;

  @Prop({ type: Number, default: 0 })
  sequence_value: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);

// Schema de Invoice (para módulo futuro de faturas)
export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({ type: String, required: true })
  invoiceNumber: string; // Número da fatura

  @Prop({ type: String, required: true })
  serviceOrderId: string; // Referência à ordem

  @Prop({ type: String, required: true })
  customerId: string;

  @Prop({
    type: Types.Decimal128,
    required: true,
    default: Types.Decimal128.fromString('0'),
  })
  totalAmount: Types.Decimal128;

  @Prop({
    type: String,
    enum: ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';

  @Prop({ type: Date, required: true })
  issueDate: Date;

  @Prop({ type: Date })
  dueDate?: Date; // Para pagamento à vista

  @Prop({ type: [Object], default: [] })
  items: InvoiceItem[];

  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  paidAmount: Types.Decimal128;

  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  remainingAmount: Types.Decimal128;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Schema de InvoiceItem (subdocumento)
@Schema({ _id: false })
export class InvoiceItem {
  @Prop({ type: String, required: true })
  serviceOrderId: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({
    type: Types.Decimal128,
    required: true,
    default: Types.Decimal128.fromString('0'),
  })
  amount: Types.Decimal128;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({ type: Number, required: true })
  installmentNumber: number; // 1, 2, 3...

  @Prop({
    type: String,
    enum: ['PENDING', 'PAID', 'OVERDUE'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'PAID' | 'OVERDUE';

  @Prop({
    type: Types.Decimal128,
    default: Types.Decimal128.fromString('0'),
  })
  paidAmount: Types.Decimal128;
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);

// Interfaces TypeScript
export interface IServiceItem {
  description: string;
  quantity: number;
  value: Types.Decimal128;
  discount: Types.Decimal128;
  addition: Types.Decimal128;
  total: Types.Decimal128;
}

export interface IServiceOrder {
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
  // Campos para integração futura
  invoiceId?: string;
  invoiceItemIds?: string[];
  paymentType: PaymentType;
  installmentCount: number;
  paidInstallments: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateServiceOrder {
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
  expectedDeliveryDate?: Date;
  notes?: string;
  paymentMethod?: PaymentMethod;
  paymentConditions?: string;
  services?: IServiceItem[];
  totalDiscount?: Types.Decimal128;
  totalAddition?: Types.Decimal128;
  // Campos para integração futura
  invoiceId?: string;
  invoiceItemIds?: string[];
  paymentType?: PaymentType;
  installmentCount?: number;
  paidInstallments?: number;
}

export interface IUpdateServiceOrder {
  equipment?: string;
  model?: string;
  brand?: string;
  serialNumber?: string;
  voltage?: string;
  accessories?: string;
  customerObservations?: string;
  reportedDefect?: string;
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
  // Campos para integração futura
  invoiceId?: string;
  invoiceItemIds?: string[];
  paymentType?: PaymentType;
  installmentCount?: number;
  paidInstallments?: number;
}

// Interfaces para módulo de faturas (futuro)
export interface IInvoice {
  id: string;
  invoiceNumber: string;
  serviceOrderId: string;
  customerId: string;
  totalAmount: Types.Decimal128;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issueDate: Date;
  dueDate?: Date;
  items: IInvoiceItem[];
  paidAmount: Types.Decimal128;
  remainingAmount: Types.Decimal128;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInvoiceItem {
  serviceOrderId: string;
  description: string;
  amount: Types.Decimal128;
  dueDate: Date;
  installmentNumber: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paidAmount: Types.Decimal128;
}

export interface ICreateInvoice {
  serviceOrderId: string;
  customerId: string;
  totalAmount: Types.Decimal128;
  issueDate: Date;
  dueDate?: Date;
  items: IInvoiceItem[];
}

export interface IInstallmentData {
  count: number; // Número de parcelas
  intervals: number[]; // Dias entre vencimentos [28, 35, 42]
  startDate: Date; // Data de início
  paymentMethod: PaymentMethod;
}

export interface ICreateServiceOrderWithInstallments
  extends ICreateServiceOrder {
  installmentData: IInstallmentData;
}
