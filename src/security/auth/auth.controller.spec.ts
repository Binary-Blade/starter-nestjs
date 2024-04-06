import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenService } from '@security/token/token.service';
import { AccessTokenGuard } from '@security/guards';
import { UpdatePasswordDTO } from './dto/update-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            updatePassword: jest.fn()
          }
        },
        {
          provide: TokenService,
          useValue: {
            refreshToken: jest.fn()
          }
        },
        {
          provide: AccessTokenGuard,
          useValue: { canActivate: jest.fn(() => true) }
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should sign up a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      jest.spyOn(authService, 'signup').mockImplementation(async () => ({}) as any);

      await expect(controller.create(createUserDto)).resolves.not.toThrow();
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const loginDto: LoginDTO = {
        email: 'test@example.com',
        password: 'password123'
      };
      jest.spyOn(authService, 'login').mockImplementation(async () => ({}) as any);

      await expect(controller.login(loginDto)).resolves.not.toThrow();
    });
  });

  describe('logout', () => {
    it('should log out a user', async () => {
      const userId = 1;
      jest.spyOn(authService, 'logout').mockImplementation(async () => ({}) as any);

      await expect(controller.logout(userId)).resolves.not.toThrow();
    });
  });

  describe('updatePassword', () => {
    it('should update the user password', async () => {
      const userId = 1;
      const updatePasswordDto: UpdatePasswordDTO = {
        oldPassword: 'oldPassword123',
        newPassword: 'newPassword123'
      };
      jest.spyOn(authService, 'updatePassword').mockImplementation(async () => undefined);
      await expect(controller.updatePassword(userId, updatePasswordDto)).resolves.not.toThrow();

      expect(authService.updatePassword).toHaveBeenCalledWith(
        userId,
        updatePasswordDto.oldPassword,
        updatePasswordDto.newPassword
      );
    });
  });
  describe('refreshToken', () => {
    it('should refresh the access token', async () => {
      const refreshTokenDto: RefreshTokenDto = { refreshToken: 'some-refresh-token' };
      jest.spyOn(tokenService, 'refreshToken').mockImplementation(async () => ({}) as any);

      await expect(controller.refreshToken(refreshTokenDto)).resolves.not.toThrow();
    });
  });
});
