import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CreatorGuard implements CanActivate {
	constructor(private reflector: Reflector) { }

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const contentOwnerId = +request.params.id;

		const isCreator = user && user.userId === contentOwnerId;
		if (!isCreator) {
			return false;
		}

		request.isCreator = isCreator;
		return true;
	}
}

