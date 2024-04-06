import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { NotFoundException } from '@nestjs/common';

jest.mock('ioredis', () => ({
  default: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn()
  }))
}));

describe('RedisService', () => {
  let service: RedisService;
  let redisClient: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'REDIS_CLIENT',
          useClass: Redis
        }
      ]
    }).compile();

    service = module.get<RedisService>(RedisService);
    redisClient = module.get('REDIS_CLIENT');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('set', () => {
    it('should call redis.set with the correct parameters', async () => {
      const key = 'testKey';
      const value = 'testValue';
      const ttl = 3600;
      await service.set(key, value, ttl);
      expect(redisClient.set).toHaveBeenCalledWith(key, value, 'EX', ttl);
    });
  });

  describe('get', () => {
    it('should retrieve the correct value for a key', async () => {
      const key = 'testKey';
      const expectedValue = 'testValue';
      (redisClient.get as jest.Mock).mockResolvedValue(expectedValue);
      const result = await service.get(key);
      expect(result).toBe(expectedValue);
      expect(redisClient.get).toHaveBeenCalledWith(key);
    });

    it('should return null when the key does not exist', async () => {
      const key = 'nonexistentKey';
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      const result = await service.get(key);
      expect(result).toBeNull();
    });
  });

  describe('del', () => {
    it('should delete a key', async () => {
      const key = 'testKey';
      (redisClient.del as jest.Mock).mockResolvedValue(1);
      const result = await service.del(key);
      expect(result).toBe(1);
      expect(redisClient.del).toHaveBeenCalledWith(key);
    });

    it('should throw NotFoundException when trying to delete a nonexistent key', async () => {
      const key = 'nonexistentKey';
      (redisClient.del as jest.Mock).mockResolvedValue(0);
      await expect(service.del(key)).rejects.toThrow(NotFoundException);
    });
  });
});
