import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: Partial<Record<keyof Repository<User>, jest.Mock>>;

  beforeEach(async () => {
    mockUsersRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsersRepository.find.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const userId = 1;
      const user = new User(); // Adjust with actual user entity properties if necessary
      mockUsersRepository.findOneBy.mockResolvedValue(user);
      expect(await service.findOne(userId)).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {}; // Adjust with actual dto properties if necessary
      const user = new User(); // Adjust with actual user entity properties if necessary

      mockUsersRepository.findOneBy.mockResolvedValue(user);
      mockUsersRepository.save.mockResolvedValue(user);

      expect(await service.update(userId, updateUserDto)).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.update(1, new UpdateUserDto())).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 1;
      const user = new User(); // Adjust with actual user entity properties if necessary

      mockUsersRepository.findOneBy.mockResolvedValue(user);
      await service.remove(userId);
      expect(mockUsersRepository.remove).toHaveBeenCalledWith(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});

