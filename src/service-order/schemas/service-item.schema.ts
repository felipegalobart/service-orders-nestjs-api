import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// Schema de serviços executados (subdocumento)
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

// Schema factory
export const ServiceItemSchema = SchemaFactory.createForClass(ServiceItem);
