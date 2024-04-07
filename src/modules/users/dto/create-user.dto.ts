import { UserRole } from '@common/enums/user-role.enum';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;

  readonly role?: UserRole;
}
