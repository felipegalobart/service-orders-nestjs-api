import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from './schemas/models/user.interface';
import { z } from 'zod';
import { ZodValidationPipe } from '../shared/pipe/zod-validation.pipe';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../auth/enums/user-role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

type UpdateUserDto = z.infer<typeof updateUserSchema>;

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Qualquer usuário autenticado pode ver seu próprio perfil
  @Get('profile')
  async getProfile(
    @CurrentUser() user: Omit<IUser, 'password'>,
  ): Promise<Omit<IUser, 'password'>> {
    return user;
  }

  // Apenas admins podem ver qualquer usuário por ID
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Omit<IUser, 'password'>> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remover senha da resposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Usuários podem atualizar seu próprio perfil, admins podem atualizar qualquer usuário
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) updateData: UpdateUserDto,
    @CurrentUser() currentUser: Omit<IUser, 'password'>,
  ): Promise<Omit<IUser, 'password'>> {
    // Verificar se o usuário está tentando atualizar seu próprio perfil ou se é admin
    if (currentUser.id !== id && currentUser.role !== UserRole.ADMIN) {
      throw new NotFoundException('User not found'); // Não revelar que o usuário existe
    }

    // Se não for admin, não pode alterar role
    if (currentUser.role !== UserRole.ADMIN && updateData.role) {
      delete updateData.role;
    }

    const updatedUser = await this.userService.update(id, updateData);

    // Remover senha da resposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  // Apenas admins podem deletar usuários
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.delete(id);
    return { message: 'User deleted successfully' };
  }

  // Endpoint especial para admins listarem todos os usuários
  @Roles(UserRole.ADMIN)
  @Get()
  async getAllUsers(): Promise<Omit<IUser, 'password'>[]> {
    const users = await this.userService.findAll();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}
