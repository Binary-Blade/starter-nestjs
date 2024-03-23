import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import { JWTTokens } from '@common/interfaces/jwt.interface';
import { SecurityService } from '@config/securities/security.service';
import { InvalidCredentialsException } from '@common/exceptions/invalid-credentials.exception';
import { TokenService } from '@config/securities/token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private securityService: SecurityService,
    private tokenService: TokenService,
  ) { }

  async signup(createUserDto: CreateUserDto, role: UserRole = UserRole.USER): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }
    const hashedPassword = await this.securityService.hashPassword(createUserDto.password);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role,
    });
    return this.usersRepository.save(newUser);
  }

  async login(email: string, password: string): Promise<JWTTokens> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new InvalidCredentialsException();
    }
    const validPassword = await this.securityService.verifyPassword(user.password, password);
    if (!validPassword) {
      throw new InvalidCredentialsException();
    }
    return this.tokenService.getTokens(user);
  }

}


