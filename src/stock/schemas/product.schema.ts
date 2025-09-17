import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IProduct } from './models/product.interface';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product implements IProduct {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  relationalId: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
