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

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
});

type UpdateUserDto = z.infer<typeof updateUserSchema>;

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) updateData: UpdateUserDto,
  ): Promise<Omit<IUser, 'password'>> {
    const updatedUser = await this.userService.update(id, updateData);

    // Remover senha da resposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.delete(id);
    return { message: 'User deleted successfully' };
  }
}
