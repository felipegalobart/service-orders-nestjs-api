import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

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

// Interface para ServiceItem
export interface IServiceItem {
  description: string;
  quantity: number;
  value: Types.Decimal128;
  discount: Types.Decimal128;
  addition: Types.Decimal128;
  total: Types.Decimal128;
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

  // Array de serviços executados
  @Prop({ type: [Object], default: [] })
  services: IServiceItem[];

  // Método para calcular totais
  calculateTotals(): void {
    if (this.services && this.services.length > 0) {
      // Calcular total dos serviços
      let servicesSum = 0;

      this.services.forEach((service: IServiceItem) => {
        const quantity = service.quantity || 1;
        const value = parseFloat(service.value?.toString() || '0');
        const discount = parseFloat(service.discount?.toString() || '0');
        const addition = parseFloat(service.addition?.toString() || '0');

        // Calcular total do serviço individual
        const serviceTotal = quantity * value + addition - discount;
        servicesSum += serviceTotal;

        // Atualizar total do serviço individual
        service.total = Types.Decimal128.fromString(serviceTotal.toString());
      });

      // Atualizar soma dos serviços
      this.servicesSum = Types.Decimal128.fromString(servicesSum.toString());

      // Calcular total geral
      const totalDiscount = parseFloat(this.totalDiscount?.toString() || '0');
      const totalAddition = parseFloat(this.totalAddition?.toString() || '0');
      const totalAmountLeft = servicesSum + totalAddition - totalDiscount;

      this.totalAmountLeft = Types.Decimal128.fromString(
        totalAmountLeft.toString(),
      );
    } else {
      // Se não há serviços, zerar totais
      this.servicesSum = Types.Decimal128.fromString('0');
      this.totalAmountLeft = Types.Decimal128.fromString('0');
    }
  }
}

// Schema factory
export const ServiceOrderSchema = SchemaFactory.createForClass(ServiceOrder);

// Middleware para calcular totais automaticamente
ServiceOrderSchema.pre('save', function () {
  this.calculateTotals();
});

ServiceOrderSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate() as Record<string, any>;
  if (update && (update.services || update.$set?.services)) {
    // Se serviços foram atualizados, recalcular totais
    const docToUpdate = update.$set || update;
    if (docToUpdate.services) {
      // Calcular totais para o documento atualizado
      const services = docToUpdate.services as IServiceItem[];
      let servicesSum = 0;

      services.forEach((service: IServiceItem) => {
        const quantity = service.quantity || 1;
        const value = parseFloat(service.value?.toString() || '0');
        const discount = parseFloat(service.discount?.toString() || '0');
        const addition = parseFloat(service.addition?.toString() || '0');

        const serviceTotal = quantity * value + addition - discount;
        servicesSum += serviceTotal;

        service.total = Types.Decimal128.fromString(serviceTotal.toString());
      });

      const totalDiscount = parseFloat(
        docToUpdate.totalDiscount?.toString() || '0',
      );
      const totalAddition = parseFloat(
        docToUpdate.totalAddition?.toString() || '0',
      );
      const totalAmountLeft = servicesSum + totalAddition - totalDiscount;

      // Atualizar campos calculados
      docToUpdate.servicesSum = Types.Decimal128.fromString(
        servicesSum.toString(),
      );
      docToUpdate.totalAmountLeft = Types.Decimal128.fromString(
        totalAmountLeft.toString(),
      );
    }
  }
});

// Índices para performance
ServiceOrderSchema.index({ orderNumber: 1 }, { unique: true });
ServiceOrderSchema.index({ customerId: 1 });
ServiceOrderSchema.index({ status: 1 });
ServiceOrderSchema.index({ entryDate: -1 });
ServiceOrderSchema.index({ isActive: 1, deletedAt: 1 });
ServiceOrderSchema.index({ financial: 1 });
ServiceOrderSchema.index({ serialNumber: 1 });
ServiceOrderSchema.index({ createdAt: -1 });

// Interfaces TypeScript
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
  invoiceId?: string;
  invoiceItemIds?: string[];
  paymentType: PaymentType;
  installmentCount: number;
  paidInstallments: number;
  servicesSum: Types.Decimal128;
  totalDiscount: Types.Decimal128;
  totalAddition: Types.Decimal128;
  totalAmountPaid: Types.Decimal128;
  totalAmountLeft: Types.Decimal128;
  isActive: boolean;
  services: IServiceItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateServiceOrder {
  orderNumber?: number;
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
  invoiceId?: string;
  invoiceItemIds?: string[];
  paymentType?: PaymentType;
  installmentCount?: number;
  paidInstallments?: number;
  services?: IServiceItem[];
  totalDiscount?: Types.Decimal128;
  totalAddition?: Types.Decimal128;
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
  invoiceId?: string;
  invoiceItemIds?: string[];
  paymentType?: PaymentType;
  installmentCount?: number;
  paidInstallments?: number;
  services?: IServiceItem[];
  totalDiscount?: Types.Decimal128;
  totalAddition?: Types.Decimal128;
}
