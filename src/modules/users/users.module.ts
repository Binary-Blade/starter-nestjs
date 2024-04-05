import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { AccessTokenStrategy } from '@security/auth/strategies/access-token.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule], // Registers the User entity for TypeORM
  controllers: [UsersController], // The controllers that are part of this module
  providers: [
    UsersService, // The service responsible for user-related operations
    AccessTokenStrategy, // AccessTokenStrategy implements JWT validation logic for Passport.
    RedisService
  ]
})
export class UsersModule {}
