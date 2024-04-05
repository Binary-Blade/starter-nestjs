import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '@modules/users/enums/user-role.enum';
import { ROLE_KEY } from '@common/decorators/role.decorator';

/**
 * A guard that enforces role-based access control. It checks if the
 * current user has the required role to access a particular route.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  /**
   * Constructs a RoleGuard instance with dependency injection.
   * @param reflector Reflector service for accessing route metadata.
   */
  constructor(private reflector: Reflector) {}

  /**
   * Method to determine if the current request is authorized based on user role.
   * @param context The context of the execution allowing to access the request data.
   * @returns Boolean or a Promise or an Observable that resolves to a boolean,
   * indicating whether access is granted.
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve the required role for the route from the metadata.
    const requiredRole = this.reflector.getAllAndOverride<UserRole>(ROLE_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    // If no specific role is required, allow access.
    if (!requiredRole) {
      return true;
    }

    // Get the user object from the request and compare roles.
    const { user } = context.switchToHttp().getRequest();
    return user.role === requiredRole;
  }
}
