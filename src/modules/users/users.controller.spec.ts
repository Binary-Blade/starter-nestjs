import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard, IsCreatorGuard, RoleGuard } from '@security/guards';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        },
        {
          provide: AccessTokenGuard,
          useValue: { canActivate: jest.fn(() => true) }
        },
        {
          provide: RoleGuard,
          useValue: { canActivate: jest.fn(() => true) }
        },
        {
          provide: IsCreatorGuard,
          useValue: { canActivate: jest.fn(() => true) }
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const result: User = new User(); // Assume this has properties you'd expect
      jest.spyOn(service, 'findOne').mockImplementation(async () => result);

      expect(await controller.findOne('1')).toBe(result);
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const result: User = new User(); // Adjust based on your User entity
      const updateUserDto: UpdateUserDto = { password: 'Updated' };
      jest.spyOn(service, 'update').mockImplementation(async () => result);

      expect(await controller.update('1', updateUserDto)).toBe(result);
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => undefined);

      await expect(controller.remove('1')).resolves.toBeUndefined();
    });
  });
});
