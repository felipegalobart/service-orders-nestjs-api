export interface IProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}