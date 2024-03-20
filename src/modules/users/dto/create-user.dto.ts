import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class CreateUserDto {

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  //TODO: Add that for production : @IsStrongPassword()
  readonly password: string;
}
