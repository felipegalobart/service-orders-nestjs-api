import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Address, AddressSchema } from './address.schema';
import { Contact, ContactSchema } from './contact.schema';

export type PersonDocument = HydratedDocument<Person>;

@Schema({ timestamps: true })
export class Person {
  _id: string;

  get id(): string {
    return this._id;
  }

  @Prop({
    type: String,
    enum: ['customer', 'supplier'],
    default: 'customer',
  })
  type?: 'customer' | 'supplier';

  @Prop({ type: String })
  name?: string;

  @Prop({
    type: String,
    unique: true,
    sparse: true,
  })
  document?: string;

  @Prop({ type: String })
  corporateName?: string;

  @Prop({ type: String })
  tradeName?: string;

  @Prop({ type: String })
  stateRegistration?: string;

  @Prop({ type: String })
  municipalRegistration?: string;

  @Prop({ type: Boolean })
  isExemptFromIE?: boolean;

  @Prop({ type: Boolean, default: false })
  pessoaJuridica?: boolean;

  @Prop({ type: Boolean, default: false })
  blacklist?: boolean;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];

  @Prop({ type: [ContactSchema], default: [] })
  contacts: Contact[];

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export const PersonSchema = SchemaFactory.createForClass(Person);

// Índices para performance
PersonSchema.index({ name: 'text' });
PersonSchema.index({ document: 1 }, { unique: true, sparse: true });
PersonSchema.index({ corporateName: 'text' });
PersonSchema.index({ 'contacts.phone': 1 });
PersonSchema.index({ type: 1, name: 1 });
PersonSchema.index({ isActive: 1, deletedAt: 1 });
PersonSchema.index({ blacklist: 1, isActive: 1 });
PersonSchema.index({ pessoaJuridica: 1, type: 1 });
PersonSchema.index({ createdAt: -1 });
