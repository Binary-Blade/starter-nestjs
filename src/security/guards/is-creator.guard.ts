import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * A guard that checks if the current user is the creator of the content
 * they are attempting to access or modify.
 */
@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current user is authorized to proceed with the request.
   * @param context The execution context containing the request data.
   * @returns A boolean indicating whether the user is authorized.
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const contentOwnerId = +request.params.id;

    // Check if the current user ID matches the content owner's ID.
    const isCreator = user && user.userId === contentOwnerId;
    if (!isCreator) {
      throw new NotFoundException(`Content not found or access unauthorized.`);
    }

    // Optionally add isCreator flag to the request object for further use.
    request.isCreator = isCreator;
    return true;
  }
}
