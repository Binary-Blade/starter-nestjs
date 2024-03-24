import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { JWTTokens } from "@common/interfaces/jwt.interface";
import { User } from "@modules/users/entities/user.entity";
import { Repository } from "typeorm";

/**
 * Service responsible for managing JWT tokens, including their creation and validation.
 * This service utilizes the JwtService for signing tokens with specified secrets and expiration times.
 */
@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // Injects the User repository for database interactions.
    private jwtService: JwtService, // Injects Nest's JwtService for token operations.
    private configService: ConfigService, // Injects ConfigService for accessing environment variables.
  ) { }

  /**
   * Generates JWT access and refresh tokens for a user.
   * 
   * @param user The user entity for whom the tokens are being generated.
   * @returns A promise that resolves to an object containing the generated tokens.
   */
  async getTokens(user: User): Promise<JWTTokens> {
    const payload = {
      sub: user.userId, // Subject field typically contains the user identifier.
      role: user.role, // Custom claim to include the user's role in the token.
      version: user.tokenVersion, // Includes tokenVersion to support token invalidation.
    };

    // Generates the access token with a specific secret and expiration time.
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
    });

    // Generates the refresh token with a different secret and longer expiration time.
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
    });

    return { token, refreshToken };
  }

  /**
   * Validates a refresh token and generates new JWT tokens if the refresh token is valid.
   * 
   * @param token The refresh token to be validated.
   * @returns A promise that resolves to new JWT access and refresh tokens.
   * @throws UnauthorizedException If the refresh token is invalid or the user does not exist.
   */
  async refreshToken(token: string): Promise<JWTTokens> {
    try {
      // Verifies the refresh token using its secret.
      const { sub: userId } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      // Retrieves the user based on the userId from the token's payload.
      const user = await this.usersRepository.findOneOrFail({ where: { userId } });

      // Generates new tokens for the user.
      return this.getTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}

