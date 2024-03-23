import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { UserRole } from "src/common/enums/user-role.enum";

export class CreateUserDto {

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  // TODO: Remove it after testing that for production - 20/03
  // @IsStrongPassword()
  readonly password: string;

  readonly role?: UserRole;

}
