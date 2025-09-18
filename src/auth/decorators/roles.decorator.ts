import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';
import { ROLES_KEY } from '../enums/user-role.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
