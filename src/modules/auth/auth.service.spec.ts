import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SecurityService } from '@config/securities/security.service';
import { TokenService } from '@config/securities/token.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { JWTTokens } from '@common/interfaces/jwt.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;
  let securityService: SecurityService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: SecurityService,
          useValue: {
            hashPassword: jest.fn(),
            verifyPassword: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            getTokens: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    securityService = module.get<SecurityService>(SecurityService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should sign up a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'strongpassword',
      };
      const user: User = new User();
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(securityService, 'hashPassword').mockResolvedValue('hashedpassword');
      jest.spyOn(usersRepository, 'create').mockReturnValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      expect(await authService.signup(createUserDto)).toEqual(user);
    });

    it('should throw an error if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'strongpassword',
      };
      const user: User = new User();
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);

      await expect(authService.signup(createUserDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should log in a user and return tokens', async () => {
      const email = 'test@example.com';
      const password = 'strongpassword';
      const user: User = new User();
      const jwtTokens: JWTTokens = { token: 'access-token', refreshToken: 'refresh-token' };
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(securityService, 'verifyPassword').mockResolvedValue(true);
      jest.spyOn(tokenService, 'getTokens').mockResolvedValue(jwtTokens);

      expect(await authService.login(email, password)).toEqual(jwtTokens);
    });
  });

});
