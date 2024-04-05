import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JWTTokens } from '@common/interfaces/jwt.interface';
import { User } from '@modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RedisService } from '@database/redis/redis.service';
import { Payload } from '@security/interfaces/payload.interface';

/**
 * Service responsible for managing JWT tokens, including their creation and validation.
 * This service utilizes the JwtService for signing tokens with specified secrets and expiration times.
 */
@Injectable()
export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiration: string;
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiration: string;
  private readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService
  ) {
    this.accessTokenSecret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
    this.accessTokenExpiration = this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION');
    this.refreshTokenSecret = this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
    this.refreshTokenExpiration = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION');
  }

  /**
   * Generates JWT access and refresh tokens for a user.
   *
   * @param user The user entity for whom the tokens are being generated.
   * @returns A promise that resolves to an object containing the generated tokens.
   */
  async getTokens(user: User): Promise<JWTTokens> {
    const payload: Payload = {
      sub: user.userId, // Subject field typically contains the user identifier.
      role: user.role, // Custom claim to include the user's role in the token.
      version: user.tokenVersion // Includes tokenVersion to support token invalidation.
    };

    const token = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    const refreshTokenTTL = this.convertDaysToSeconds(this.refreshTokenExpiration);
    await this.redisService.set(`refresh_token_${user.userId}`, refreshToken, refreshTokenTTL);
    return { token, refreshToken };
  }

  async refreshToken(token: string): Promise<JWTTokens> {
    this.logger.debug(`Refreshing token for token: ${token}`);
    try {
      const userId = await this.verifyRefreshToken(token);
      await this.removeRefreshToken(userId);

      const user = await this.usersRepository.findOneOrFail({ where: { userId } });
      const tokens = await this.getTokens(user);

      const refreshTokenTTL = this.convertDaysToSeconds(this.refreshTokenExpiration);
      await this.redisService.set(`refresh_token_${userId}`, tokens.refreshToken, refreshTokenTTL);

      return tokens;
    } catch (error) {
      this.logger.error('Token refresh error', { error: error.message, stack: error.stack });
      throw new UnauthorizedException('Could not refresh the token. Please try again or log in.');
    }
  }

  private async verifyRefreshToken(token: string): Promise<number> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.refreshTokenSecret
      });
      const userId = payload.sub;
      const tokenExists = await this.refreshTokenExists(userId, token);

      if (!tokenExists) {
        this.logger.warn(`Token does not exist for user: ${userId}`);
        throw new UnauthorizedException('Refresh token does not exist or is no longer valid.');
      }
      return userId;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        this.logger.warn(`Expired token: ${error.message}`, error.stack);
        throw new UnauthorizedException('Refresh token expired.');
      } else {
        this.logger.error(`Token verification error: ${error.message}`, error.stack);
        throw new UnauthorizedException('Invalid refresh token.');
      }
    }
  }

  private generateAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: this.accessTokenExpiration
    });
  }

  private generateRefreshToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.refreshTokenExpiration
    });
  }

  async removeRefreshToken(userId: number) {
    await this.redisService.del(`refresh_token_${userId}`);
  }

  async refreshTokenExists(userId: number, refreshToken: string): Promise<boolean> {
    const storedToken = await this.redisService.get(`refresh_token_${userId}`);
    return storedToken === refreshToken;
  }

  private convertDaysToSeconds(duration: string): number {
    const days = parseInt(duration.replace('d', ''), 10); // Assure la suppression du 'd' pour la conversion
    return isNaN(days) ? 0 : days * 86400;
  }
}
