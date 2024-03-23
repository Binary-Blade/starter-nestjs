import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@config/securities/token.service';
import { SecurityService } from '@config/securities/security.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registers the User entity for TypeORM
  controllers: [AuthController], // The controllers that are part of this module
  providers: [
    AuthService, // The service responsible for handling authentication logic
    UsersService, // The service responsible for user-related operations
    TokenService, // The service responsible for handling token-related operations
    JwtService, // Nest's JwtService for JWT operations such as signing and verification
    SecurityService, // A service for handling common security tasks such as hashing
  ],
})
export class AuthModule { }
