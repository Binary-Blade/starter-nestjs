import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  readonly newPassword: string;
}
