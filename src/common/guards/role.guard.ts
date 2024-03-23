import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRole } from "src/modules/users/entities/user.entity";
import { ROLE_KEY } from "../decorators/role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) { }

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const requiredRole = this.reflector.getAllAndOverride<UserRole>(
			ROLE_KEY, [context.getHandler(), context.getClass()]
		)
		if (!requiredRole) {
			return true;
		}
		const { user } = context.switchToHttp().getRequest();
		return user.role === requiredRole;
	}
}
