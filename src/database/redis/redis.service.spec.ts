import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  const environments = [
    { env: 'development', prefix: 'dev:' },
    { env: 'production', prefix: 'prod:' }
  ];

  environments.forEach(({ env, prefix }) => {
    describe(`when environment is ${env}`, () => {
      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            RedisService,
            {
              provide: 'REDIS_CLIENT',
              useClass: Redis
            },
            {
              provide: ConfigService,
              useValue: {
                get: jest.fn((key: string) => {
                  if (key === 'NODE_ENV') return env;
                  return prefix; // Assuming that for simplicity, any other call returns the prefix directly
                })
              }
            }
          ]
        }).compile();

        service = module.get<RedisService>(RedisService);
        redisClient = module.get('REDIS_CLIENT');
      });

      it('should be defined', () => {
        expect(service).toBeDefined();
      });

      it('should call redis.set with the correct parameters including prefix', async () => {
        const key = 'testKey';
        const value = 'testValue'; // Assuming value is already a string based on your test
        const ttl = 3600;
        const expectedFullKey = `${prefix}${key}`;
        await service.set(key, value, ttl);
        expect(redisClient.set).toHaveBeenCalledWith(expectedFullKey, value, 'EX', ttl);
      });

      it('should retrieve the correct value for a key including prefix', async () => {
        const key = 'testKey';
        const expectedValue = 'testValue';
        const expectedFullKey = `${prefix}${key}`;
        (redisClient.get as jest.Mock).mockResolvedValue(expectedValue);
        const result = await service.get(key);
        expect(result).toBe(expectedValue);
        expect(redisClient.get).toHaveBeenCalledWith(expectedFullKey);
      });

      it('should return null when the key with prefix does not exist', async () => {
        const key = 'nonexistentKey';
        const expectedFullKey = `${prefix}${key}`;
        (redisClient.get as jest.Mock).mockResolvedValue(null);
        const result = await service.get(key);
        expect(result).toBeNull();
        expect(redisClient.get).toHaveBeenCalledWith(expectedFullKey);
      });

      it('should delete a key including prefix', async () => {
        const key = 'testKey';
        const expectedFullKey = `${prefix}${key}`;
        (redisClient.del as jest.Mock).mockResolvedValue(1);
        const result = await service.del(key);
        expect(result).toBe(1);
        expect(redisClient.del).toHaveBeenCalledWith(expectedFullKey);
      });

      it('should throw NotFoundException when trying to delete a nonexistent key including prefix', async () => {
        const key = 'nonexistentKey';
        const expectedFullKey = `${prefix}${key}`;
        (redisClient.del as jest.Mock).mockResolvedValue(0);
        await expect(service.del(key)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
