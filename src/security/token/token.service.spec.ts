import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { TokenService } from '@security/token/token.service';
import { RedisService } from '@database/redis/redis.service';
import { UserRole } from '@modules/users/enums/user-role.enum';
import { UnauthorizedException } from '@nestjs/common';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verifyAsync: jest.fn()
          }
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(key => {
              switch (key) {
                case 'JWT_ACCESS_TOKEN_SECRET':
                  return 'access-secret';
                case 'JWT_REFRESH_TOKEN_SECRET':
                  return 'refresh-secret';
                case 'JWT_ACCESS_TOKEN_EXPIRATION':
                  return '1h';
                case 'JWT_REFRESH_TOKEN_EXPIRATION':
                  return '7d';
                default:
                  return null;
              }
            })
          }
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            findOneOrFail: jest.fn()
          }
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const user: User = { userId: 1, role: UserRole.USER, tokenVersion: 1 } as User;
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockToken');

      const tokens = await service.getTokens(user);

      expect(tokens).toHaveProperty('token', 'mockToken');
      expect(tokens).toHaveProperty('refreshToken', 'mockToken');
      expect(jwtService.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('refreshToken', () => {
    it('should refresh the token successfully', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: 1 });
      jest.spyOn(redisService, 'get').mockResolvedValue('mockRefreshToken');
      jest.spyOn(redisService, 'set').mockResolvedValue('OK');
      jest
        .spyOn(service, 'getTokens')
        .mockResolvedValue({ token: 'newAccessToken', refreshToken: 'newRefreshToken' });

      const tokens = await service.refreshToken('mockRefreshToken');

      expect(tokens).toEqual({ token: 'newAccessToken', refreshToken: 'newRefreshToken' });
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify the refresh token successfully and return the userId', async () => {
      const mockUserId = 1;
      const mockRefreshToken = 'valid-refresh-token';
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: mockUserId });
      jest.spyOn(redisService, 'get').mockResolvedValue(mockRefreshToken);

      const userId = await service.verifyRefreshToken(mockRefreshToken);

      expect(userId).toEqual(mockUserId);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockRefreshToken, {
        secret: 'refresh-secret'
      });
      expect(redisService.get).toHaveBeenCalledWith(`refresh_token_${mockUserId}`);
    });

    it('should throw UnauthorizedException if the refresh token does not exist', async () => {
      const mockRefreshToken = 'invalid-refresh-token';
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: 1 });
      jest.spyOn(redisService, 'get').mockResolvedValue(null);

      await expect(service.verifyRefreshToken(mockRefreshToken)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if the refresh token is expired', async () => {
      const mockRefreshToken = 'expired-refresh-token';
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('TokenExpiredError'));

      await expect(service.verifyRefreshToken(mockRefreshToken)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('removeRefreshToken', () => {
    it('should successfully remove the refresh token', async () => {
      const mockUserId = 1;
      jest.spyOn(redisService, 'del').mockResolvedValue(1);

      const result = await service.removeRefreshToken(mockUserId);

      expect(result).toBeUndefined();
      expect(redisService.del).toHaveBeenCalledWith(`refresh_token_${mockUserId}`);
    });

    it('should not throw an error if the refresh token does not exist', async () => {
      const mockUserId = 2;
      jest.spyOn(redisService, 'del').mockResolvedValue(0);

      await expect(service.removeRefreshToken(mockUserId)).resolves.toBeUndefined();
    });
  });

  // Add more tests for verifyRefreshToken, removeRefreshToken, etc.
});
