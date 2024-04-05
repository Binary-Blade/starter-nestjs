import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@modules/users/users.service';
import { TokenService } from '@security/token/token.service';
import { EncryptionService } from '@security/encryption/encryption.service';
import { User } from '@modules/users/entities/user.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule], // Registers the User entity for TypeORM
  controllers: [AuthController], // The controllers that are part of this module
  providers: [
    AuthService, // The service responsible for handling authentication logic
    UsersService, // The service responsible for user-related operations
    TokenService, // The service responsible for handling token-related operations
    JwtService, // Nest's JwtService for JWT operations such as signing and verification
    EncryptionService, // A service for handling common security tasks such as hashing
    RedisService
  ]
})
export class AuthModule {}
