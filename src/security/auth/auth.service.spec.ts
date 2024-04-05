import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JWTTokens } from '@common/interfaces/jwt.interface';
import { CreateUserDto } from '@modules/users/dto';
import { EncryptionService } from '@security/encryption/encryption.service';
import { TokenService } from '@security/token/token.service';
import { User } from '@modules/users/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;
  let encryptionService: EncryptionService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn()
          }
        },
        {
          provide: EncryptionService,
          useValue: {
            hashPassword: jest.fn(),
            verifyPassword: jest.fn()
          }
        },
        {
          provide: TokenService,
          useValue: {
            getTokens: jest.fn(),
            refreshToken: jest.fn() // Assuming there's a method to refresh tokens
          }
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    encryptionService = module.get<EncryptionService>(EncryptionService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    it('should sign up a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'strongpassword'
      };
      const user: User = new User();
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(encryptionService, 'hashPassword').mockResolvedValue('hashedpassword');
      jest.spyOn(usersRepository, 'create').mockReturnValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      expect(await authService.signup(createUserDto)).toEqual(user);
    });

    it('should throw an error if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'strongpassword'
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
      jest.spyOn(encryptionService, 'verifyPassword').mockResolvedValue(true);
      jest.spyOn(tokenService, 'getTokens').mockResolvedValue(jwtTokens);

      expect(await authService.login(email, password)).toEqual(jwtTokens);
    });
  });

  describe('logout', () => {
    it('should increment tokenVersion for the user', async () => {
      const userId = 1;
      const user = new User();
      user.userId = userId;
      user.tokenVersion = 0;

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'save').mockImplementation(async (user: User) => {
        return { ...user, tokenVersion: user.tokenVersion + 1 };
      });

      await authService.logout(userId);
      expect(usersRepository.save).toHaveBeenCalledWith({ ...user, tokenVersion: 1 });
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(authService.logout(1)).rejects.toThrow(NotFoundException);
    });
  });
});
