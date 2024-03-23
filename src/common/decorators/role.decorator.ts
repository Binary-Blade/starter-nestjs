import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../enums/user-role.enum";

export const ROLE_KEY = 'role';
export const Role = (role: UserRole) => SetMetadata(ROLE_KEY, role);
