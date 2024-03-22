import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { JWTTokens } from "src/common/interfaces/jwt.interface";
import { User } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,

  ) { }


  // TODO: Create one unique token per user
  async getTokens(user: User): Promise<JWTTokens> {
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user.userId, role: user.role },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION'),
        }
      ),
      this.jwtService.signAsync(
        { sub: user.userId, role: user.role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION'),
        }
      ),
    ]);
    return { token, refreshToken }
  }

  async refreshToken(token: string): Promise<JWTTokens> {
    try {
      const { sub: userId } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.usersRepository.findOneOrFail({ where: { userId } });

      return this.getTokens(user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

}
