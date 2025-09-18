import { IUser, ICreateUser } from '../schemas/models/user.interface';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract findById(id: string): Promise<IUser | null>;
  abstract findAll(): Promise<IUser[]>;
  abstract create(userData: ICreateUser): Promise<IUser>;
  abstract update(id: string, userData: Partial<IUser>): Promise<IUser>;
  abstract delete(id: string): Promise<void>;
}
