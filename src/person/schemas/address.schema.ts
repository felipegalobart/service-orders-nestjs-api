import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

@Schema({ _id: false })
export class Address {
  @Prop({ type: String })
  street?: string;

  @Prop({ type: String })
  number?: string;

  @Prop({ type: String })
  complement?: string;

  @Prop({ type: String })
  neighborhood?: string;

  @Prop({ type: String })
  city?: string;

  @Prop({ type: String })
  state?: string;

  @Prop({ type: String })
  zipCode?: string;

  @Prop({ type: String, default: 'Brasil' })
  country?: string;

  @Prop({ type: Boolean, required: true, default: true })
  isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
