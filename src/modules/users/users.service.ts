import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SecurityService } from 'src/common/security/security.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private securityService: SecurityService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new UnprocessableEntityException('Email already exists');
    }
    const hashedPassword = await this.securityService.hashPassword(createUserDto.password);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    return this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ userId: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // TODO: VERIFY IF Only user can update himself
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ userId: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ userId: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.remove(user);
  }

}
