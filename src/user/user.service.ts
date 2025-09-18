import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { IUser, ICreateUser } from './schemas/models/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<IUser | null> {
    return this.userRepository.findById(id);
  }

  async create(userData: ICreateUser): Promise<IUser> {
    return this.userRepository.create(userData);
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser> {
    return this.userRepository.update(id, userData);
  }

  async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }

  // Método para verificar senha durante login
  async validatePassword(
    email: string,
    password: string,
  ): Promise<Omit<IUser, 'password'> | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    // Usar bcrypt diretamente para comparar senhas
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      // Remover senha da resposta
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }

    return null;
  }
}
