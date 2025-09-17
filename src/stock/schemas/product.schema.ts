import { Schema } from '@nestjs/mongoose';
import { IProduct } from './models/product.interface';

@Schema()
export class Product implements IProduct {
  id?: string | undefined;
  name: string;
  quantity: number;
  relationalId: number;
}
