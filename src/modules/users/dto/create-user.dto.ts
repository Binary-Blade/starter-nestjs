import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()

  //@IsStrongPassword()
  readonly password: string;

  readonly role?: UserRole;
}
