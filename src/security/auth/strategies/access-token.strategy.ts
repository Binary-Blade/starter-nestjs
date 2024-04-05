import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@common/interfaces/jwt.interface';
import { User } from '@modules/users/entities/user.entity';
import { Repository } from 'typeorm';

/**
 * Passport strategy for JWT access token validation.
 * This strategy is responsible for extracting the JWT from the authorization header,
 * and validating its integrity and expiration status.
 */
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * The constructor for the AccessTokenStrategy.
   * @param usersRepository The TypeORM repository for the User entity.
   * @param configService The service to access the configuration environment and defaults.
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Auth Header
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ?? '', // Get the secret key for verifying the token
      ignoreExpiration: false // Ensure the expiration is not ignored
    });
  }

  /**
   * Validates a JWT's payload to authenticate a user request.
   * @param payload The decoded JWT payload.
   * @returns A Promise resolved with the User object associated with the token.
   * @throws UnauthorizedException if the user cannot be found or the token is invalid.
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { userId: payload.sub } });
    if (!user || user.tokenVersion !== payload.version) {
      throw new UnauthorizedException('Token has been invalidated');
    }

    // Return the user object for request property attachment if validation passes
    return user;
  }
}
