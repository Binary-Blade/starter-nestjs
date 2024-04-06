import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exception for when the user provides invalid login credentials.
 */
export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid Login Credentials. Please try again.', HttpStatus.UNAUTHORIZED);
  }
}
