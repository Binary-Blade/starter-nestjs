import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/*
 * Custom decorator that extracts the user ID from the request object.
 * This decorator can be used to inject the user ID into a controller method.
 * @returns The user ID extracted from the request object.
 * @example:
 * @Post('logout')
 * async logout(@UserId() userId: number) {
 *  await this.authService.logout(userId);
 *  return { message: 'Logged out successfully' };
 *  }
 */
export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext): number => {
  const request = ctx.switchToHttp().getRequest();
  return request.user.userId; // Assuming `user` is always present in the request object
});
