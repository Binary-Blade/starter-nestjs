import { UserRole } from '@modules/users/enums/user-role.enum';
import { SetMetadata } from '@nestjs/common';

/**
 * Decorator for specifying the role required to access a route.
 * @param role The role required to access the route.
 */
export const ROLE_KEY = 'role';
export const Role = (role: UserRole) => SetMetadata(ROLE_KEY, role);
