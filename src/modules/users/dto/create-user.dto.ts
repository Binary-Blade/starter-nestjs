import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { UserRole } from "../enums/user-role.enum";

export class CreateUserDto {

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  // NOTE: Remove it after testing that for production
  // @IsStrongPassword()
  readonly password: string;

  readonly role?: UserRole;

}
