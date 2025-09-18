export interface IUser {
  id?: string;
  email: string;
  password: string; // ← Será criptografada
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para dados de criação (sem senha criptografada)
export interface ICreateUser {
  email: string;
  password: string; // ← Senha em texto plano
  name: string;
}

// Interface para dados de login
export interface ILoginUser {
  email: string;
  password: string; // ← Senha em texto plano
}
