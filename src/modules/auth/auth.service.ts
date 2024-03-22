import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { JWTTokens } from 'src/common/interfaces/jwt.interface';
import { SecurityService } from 'src/config/securities/security.service';
import { InvalidCredentialsException } from 'src/common/exceptions/invalid-credentials.exception';
import { TokenService } from 'src/config/securities/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private securityService: SecurityService,
    private tokenService: TokenService,
  ) { }

  async signup(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async login(email: string, password: string): Promise<JWTTokens> {
    const user = await this.usersRepository.findOneBy({ email });
    const validPassword = await this.securityService.verifyPassword(user.password, password);

    if (!user) throw new InvalidCredentialsException();
    if (!validPassword) throw new InvalidCredentialsException();

    return this.tokenService.getTokens(user);
  }

}


