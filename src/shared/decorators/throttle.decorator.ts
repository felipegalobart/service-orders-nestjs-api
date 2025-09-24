import { SetMetadata } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

// Decorator para endpoints de autenticação (mais restritivo)
export const ThrottleAuth = () =>
  Throttle({ default: { limit: 5, ttl: 60000 } }); // 5 requests por minuto

// Decorator para endpoints públicos (moderado)
export const ThrottlePublic = () =>
  Throttle({ default: { limit: 20, ttl: 60000 } }); // 20 requests por minuto

// Decorator para endpoints administrativos (muito restritivo)
export const ThrottleAdmin = () =>
  Throttle({ default: { limit: 200, ttl: 60000 } }); // 3 requests por minuto

// Decorator para endpoints de usuário (padrão)
export const ThrottleUser = () =>
  Throttle({ default: { limit: 200, ttl: 60000 } }); // 10 requests por minuto

// Decorator para bypass do throttling (endpoints críticos)
export const SkipThrottle = () => SetMetadata('skipThrottle', true);
