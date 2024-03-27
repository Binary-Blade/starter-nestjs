import { UserRole } from '@modules/users/enums/user-role.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const Role = (role: UserRole) => SetMetadata(ROLE_KEY, role);
