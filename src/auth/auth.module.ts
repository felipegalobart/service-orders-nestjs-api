import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule,
    UserModule, // ← Importa UserModule para usar UserService
  ],
  providers: [
    AuthService,
    JwtStrategy, // ← Registra a estratégia JWT
  ],
  controllers: [AuthController],
  exports: [AuthService], // ← Exporta para usar em outros módulos
})
export class AuthModule {}
