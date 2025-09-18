import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { z } from 'zod';
import { ZodValidationPipe } from '../shared/pipe/zod-validation.pipe';

// Schema para login
const loginSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema para registro
const registerSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type LoginDto = z.infer<typeof loginSchema>;
type RegisterDto = z.infer<typeof registerSchema>;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }
}
