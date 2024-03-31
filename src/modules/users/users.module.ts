import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AccessTokenStrategy } from '../auth/strategies/access-token.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registers the User entity for TypeORM
  controllers: [UsersController], // The controllers that are part of this module
  providers: [
    UsersService, // The service responsible for user-related operations
    AccessTokenStrategy // AccessTokenStrategy implements JWT validation logic for Passport.
  ]
})
export class UsersModule {}
