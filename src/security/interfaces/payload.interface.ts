import { UserRole } from '@modules/users/enums/user-role.enum';

export interface Payload {
  sub: number;
  role: UserRole;
  version: number;
}
