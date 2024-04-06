import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { TokenService } from '@security/token/token.service';
import { RedisService } from '@database/redis/redis.service';
import { UserRole } from '@modules/users/enums/user-role.enum';
import { UnauthorizedException } from '@nestjs/common';
import { UtilsService } from '@common/utils/utils.service';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;
  let redisService: RedisService;
  let utilsService: UtilsService;

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
        },
        {
          provide: UtilsService,
          useValue: {
            convertDaysToSeconds: jest.fn().mockReturnValue(604800) // 7 days in seconds
          }
        }
      ]
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
    utilsService = module.get<UtilsService>(UtilsService);
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
      // Vérifiez que convertDaysToSeconds a été appelé avec la bonne valeur
      expect(utilsService.convertDaysToSeconds).toHaveBeenCalledWith('7d');
    });
  });

  describe('refreshToken', () => {
    it('should refresh the token successfully', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: 1 });
      jest.spyOn(redisService, 'get').mockResolvedValue('mockRefreshToken');
      jest.spyOn(redisService, 'set').mockResolvedValue('OK');
      jest.spyOn(utilsService, 'convertDaysToSeconds').mockReturnValue(604800); // 7 days in seconds
      jest
        .spyOn(service, 'getTokens')
        .mockResolvedValue({ token: 'newAccessToken', refreshToken: 'newRefreshToken' });

      const tokens = await service.refreshToken('mockRefreshToken');

      expect(tokens).toEqual({ token: 'newAccessToken', refreshToken: 'newRefreshToken' });
      expect(redisService.set).toHaveBeenCalled();
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('mockRefreshToken', {
        secret: expect.any(String)
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
        expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockRefreshToken, expect.any(Object));
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
    });

    describe('removeRefreshToken', () => {
      it('should successfully remove the refresh token', async () => {
        const mockUserId = 1;
        jest.spyOn(redisService, 'del').mockResolvedValue('Key deleted: refresh_token_1');

        const result = await service.removeRefreshToken(mockUserId);

        expect(result).toBeUndefined();
        expect(redisService.del).toHaveBeenCalledWith(`refresh_token_${mockUserId}`);
      });

      it('should not throw an error if the refresh token does not exist', async () => {
        const mockUserId = 2;
        jest.spyOn(redisService, 'del').mockResolvedValue('Key not found: refresh_token_2');

        await expect(service.removeRefreshToken(mockUserId)).resolves.toBeUndefined();
      });
    });
  });
});
