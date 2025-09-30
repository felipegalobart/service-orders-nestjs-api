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
  DEBITO = 'debit',
  CREDITO = 'credit',
  DINHEIRO = 'cash',
  PIX = 'pix',
  BOLETO = 'boleto',
  TRANSFERENCIA = 'transfer',
  CHEQUE = 'check',
}

export enum PaymentType {
  CASH = 'cash',
  INSTALLMENT = 'installment',
  STORE_CREDIT = 'store_credit',
}

// Tipo do documento
export type ServiceOrderDocument = HydratedDocument<ServiceOrder>;

// Schema principal
@Schema({ timestamps: true })
export class ServiceOrder {
  _id: string;

  get id(): string {
    return this._id;
  }

  // Campos principais
  @Prop({ type: Number, unique: true, required: true })
  orderNumber: number;

  @Prop({ type: String, required: true })
  customerId: string;

  // Equipamento
  @Prop({ type: String, required: true })
  equipment: string;

  @Prop({ type: String })
  model?: string;

  @Prop({ type: String })
  brand?: string;

  @Prop({ type: String })
  serialNumber?: string;

  @Prop({ type: String })
  voltage?: string;

  @Prop({ type: String })
  accessories?: string;

  @Prop({ type: String })
  customerObservations?: string;

  @Prop({ type: String })
  reportedDefect?: string;

  @Prop({ type: Boolean, default: false })
  warranty?: boolean;

  @Prop({ type: Boolean, default: false })
  isReturn?: boolean;

  // Status e controle
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

  @Prop({
    type: String,
    enum: PaymentMethod,
  })
  paymentMethod?: PaymentMethod;

  @Prop({ type: String })
  paymentConditions?: string;

  // Notas fiscais
  @Prop({ type: String })
  serviceInvoice?: string;

  @Prop({ type: String })
  saleInvoice?: string;

  @Prop({ type: String })
  shippingInvoice?: string;

  // Campos para integração futura com módulo de faturas
  @Prop({ type: String })
  invoiceId?: string;

  @Prop({ type: [String], default: [] })
  invoiceItemIds?: string[];

  @Prop({
    type: String,
    enum: PaymentType,
    default: PaymentType.CASH,
  })
  paymentType: PaymentType;

  @Prop({ type: Number, default: 1 })
  installmentCount: number;

  @Prop({ type: Number, default: 0 })
  paidInstallments: number;

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

// Schema factory
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
