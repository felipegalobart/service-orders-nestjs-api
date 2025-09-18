import { UserRole } from '../../../auth/enums/user-role.enum';

export interface IUser {
  id: string;
  email: string;
  password: string; // ← Será criptografada
  name: string;
  role: UserRole; // ← Nova propriedade para roles
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para dados de criação (sem senha criptografada)
export interface ICreateUser {
  email: string;
  password: string; // ← Senha em texto plano
  name: string;
  role?: UserRole; // ← Role opcional, padrão será USER
}

// Interface para dados de login
export interface ILoginUser {
  email: string;
  password: string; // ← Senha em texto plano
}
