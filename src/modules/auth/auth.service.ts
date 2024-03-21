import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersService: UsersService,
  ) { }

  async signup(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}


