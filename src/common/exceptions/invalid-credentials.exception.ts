import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidCredentialsException extends HttpException {
	constructor() {
		super('Invalid Login Credentials. Please try again.', HttpStatus.UNAUTHORIZED);
	}
}
