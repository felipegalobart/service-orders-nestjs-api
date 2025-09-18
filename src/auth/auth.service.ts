import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  IUser,
  ICreateUser,
  ILoginUser,
} from '../user/schemas/models/user.interface';

// Interface para o payload JWT
interface IJwtPayload {
  email: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Validar usuário durante login
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<IUser, 'password'> | null> {
    return this.userService.validatePassword(email, password);
  }

  // Fazer login e gerar JWT
  async login(loginData: ILoginUser) {
    const user = await this.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }

  // Registrar novo usuário
  async register(registerData: ICreateUser) {
    // Verificar se usuário já existe
    const existingUser = await this.userService.findByEmail(registerData.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Criar novo usuário
    const user = await this.userService.create(registerData);

    // Gerar token para o novo usuário
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  // Validar usuário pelo payload do JWT
  async validateUserByPayload(
    payload: IJwtPayload,
  ): Promise<Omit<IUser, 'password'> | null> {
    const user = await this.userService.findById(payload.sub);
    if (!user) return null;

    // Remover senha da resposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
