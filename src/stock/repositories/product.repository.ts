import { IProduct } from '../schemas/models/product.interface';

export abstract class ProductRepository {
  abstract getAllStock(limit: number, page: number): Promise<IProduct[]>;
  abstract getStockById(productId: string): Promise<IProduct>;
  abstract createStock(product: IProduct): Promise<IProduct>;
  abstract updateStock(productId: string, stock: number): Promise<IProduct>;
  abstract deleteStock(productId: string): Promise<void>;
}
