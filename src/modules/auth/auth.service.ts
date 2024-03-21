import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) { }

  async signup(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}


