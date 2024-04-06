import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@database/redis/redis.module';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@database/redis/redis.service';
import { UtilsService } from '@common/utils/utils.service';
import { UsersService } from '@modules/users/users.service';
import { TokenService } from '@security/token/token.service';
import { EncryptionService } from '@security/encryption/encryption.service';
import { AuthController } from './auth.controller';
import { User } from '@modules/users/entities/user.entity';

/**
 * Module for handling authentication-related operations.
 *
 * @class AuthModule class (module) for handling authentication-related operations
 * @method imports Import the necessary modules for this module
 * @method controllers Register the controllers that are part of this module
 * @method providers Register the services that are part of this module
 *
 */
@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule], // Registers the User entity for TypeORM
  controllers: [AuthController], // The controllers that are part of this module
  providers: [
    AuthService, // The service responsible for handling authentication logic
    UsersService, // The service responsible for user-related operations
    TokenService, // The service responsible for handling token-related operations
    JwtService, // Nest's JwtService for JWT operations such as signing and verification
    EncryptionService, // A service for handling common security tasks such as hashing
    UtilsService, // A utility service for common tasks such as generating random strings
    RedisService // A service for interacting with the Redis store
  ]
})
export class AuthModule {}
