import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { SecurityService } from 'src/config/securities/security.service';
import { AccessTokenStrategy } from '../auth/strategies/access-token.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, SecurityService, JwtService, AccessTokenStrategy],
})
export class UsersModule { }
