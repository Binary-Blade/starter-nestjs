import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLE_KEY } from "../decorators/role.decorator";
import { UserRole } from "@modules/users/enums/user-role.enum";

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
