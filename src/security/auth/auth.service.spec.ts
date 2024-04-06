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
import { InvalidCredentialsException } from '@common/exceptions/invalid-credentials.exception';

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
            refreshToken: jest.fn(),
            removeRefreshToken: jest.fn()
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

  describe('updatePassword', () => {
    it('should successfully update the user password', async () => {
      const userId = 1;
      const oldPassword = 'oldPassword';
      const newPassword = 'newPassword';
      const user = new User();
      user.userId = userId;
      user.password = 'hashedOldPassword';

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(encryptionService, 'verifyPassword').mockResolvedValue(true);
      jest.spyOn(encryptionService, 'hashPassword').mockResolvedValue('hashedNewPassword');
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      await authService.updatePassword(userId, oldPassword, newPassword);

      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ password: 'hashedNewPassword' })
      );
    });

    it('should throw an error if old password is incorrect', async () => {
      const userId = 1;
      const oldPassword = 'wrongOldPassword';
      const newPassword = 'newPassword';
      const user = new User();
      user.userId = userId;
      user.password = 'hashedOldPassword';

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(encryptionService, 'verifyPassword').mockResolvedValue(false);

      await expect(authService.updatePassword(userId, oldPassword, newPassword)).rejects.toThrow(
        InvalidCredentialsException
      );
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      const userId = 1;
      const oldPassword = 'oldPassword';
      const newPassword = 'newPassword';

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(authService.updatePassword(userId, oldPassword, newPassword)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('logout', () => {
    it('should increment tokenVersion for the user', async () => {
      const userId = 1;
      const initialTokenVersion = 1;
      const user = new User();
      user.userId = userId;
      user.tokenVersion = initialTokenVersion;

      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);

      jest.spyOn(tokenService, 'removeRefreshToken').mockImplementation(async () => undefined);
      jest.spyOn(usersRepository, 'save').mockImplementation(async (user: User) => user);

      await authService.logout(userId);

      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ tokenVersion: initialTokenVersion + 1 })
      );
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(null);

      await expect(authService.logout(1)).rejects.toThrow(NotFoundException);
    });
  });
});
