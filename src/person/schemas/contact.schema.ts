import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContactDocument = HydratedDocument<Contact>;

@Schema({ _id: false })
export class Contact {
  @Prop({ type: String })
  name?: string;

  @Prop({ type: String })
  phone?: string;

  @Prop({
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email deve ter formato válido',
  })
  email?: string;

  @Prop({ type: String })
  sector?: string;

  @Prop({ type: Boolean, default: false })
  isWhatsApp?: boolean;

  @Prop({ type: Boolean, required: true, default: true })
  isDefault: boolean;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
