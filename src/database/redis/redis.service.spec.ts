import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import { KeyValuePairs } from '@common/interfaces/key-value-redis.interface';

jest.mock('ioredis', () => ({
  default: jest.fn().mockImplementation(() => ({
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    pipeline: jest.fn().mockReturnThis(),
    exec: jest.fn()
  }))
}));

describe('RedisService', () => {
  let service: RedisService;
  let redisClient: Redis;

  const setupModule = async (environment = 'development') => {
    const prefix = environment === 'production' ? 'prod:' : 'dev:';
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
            get: jest.fn(key => {
              if (key === 'NODE_ENV') return environment;
              return prefix; // Simplify to always return prefix for non-NODE_ENV keys
            })
          }
        }
      ]
    }).compile();

    return {
      service: module.get<RedisService>(RedisService),
      redisClient: module.get('REDIS_CLIENT'),
      prefix
    };
  };

  describe.each([
    ['development', 'dev:'],
    ['production', 'prod:']
  ])('when environment is %s', (env, prefix) => {
    beforeEach(async () => {
      const setup = await setupModule(env);
      service = setup.service;
      redisClient = setup.redisClient;
    });

    // Test Definitions...

    describe('set method', () => {
      it('should call redis.set with correct parameters and prefix', async () => {
        const key = 'testKey';
        const value = 'testValue';
        const ttl = 3600;
        const expectedFullKey = `${prefix}${key}`;

        await service.set(key, value, ttl);

        expect(redisClient.set).toHaveBeenCalledWith(expectedFullKey, value, 'EX', ttl);
      });

      it('should throw an error if key is missing', async () => {
        await expect(service.set('', 'value')).rejects.toThrow('Key is required');
      });

      it('should handle errors when setting a value fails', async () => {
        const key = 'testKey';
        const value = 'testValue';
        (redisClient.set as jest.Mock).mockImplementation(() => {
          throw new Error('Failed to set value');
        });

        await expect(service.set(key, value)).rejects.toThrow('Failed to set value');
      });
    });

    describe('get method', () => {
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

      it('should handle errors when getting a value fails', async () => {
        const key = 'testKey';
        (redisClient.get as jest.Mock).mockImplementation(() => {
          throw new Error('Failed to get value');
        });

        await expect(service.get(key)).rejects.toThrow('Failed to get value');
      });
    });

    describe('del method', () => {
      it('should delete a key including prefix and return a success message', async () => {
        const key = 'testKey';
        const expectedFullKey = `${prefix}${key}`;
        (redisClient.del as jest.Mock).mockResolvedValue(1);

        const result = await service.del(key);

        expect(result).toBe(`Key deleted: ${expectedFullKey}`);
        expect(redisClient.del).toHaveBeenCalledWith(expectedFullKey);
      });

      it('should return a not found message when trying to delete a nonexistent key', async () => {
        const key = 'nonexistentKey';
        const expectedFullKey = `${prefix}${key}`;
        (redisClient.del as jest.Mock).mockResolvedValue(0);

        const result = await service.del(key);

        expect(result).toBe(`Key not found: ${expectedFullKey}`);
      });

      it('should handle errors when deletion fails', async () => {
        const key = 'testKey';
        (redisClient.del as jest.Mock).mockImplementation(() => {
          throw new Error('Failed to delete key');
        });

        await expect(service.del(key)).rejects.toThrow('Failed to delete key');
      });
    });

    describe('setMultiple method', () => {
      it('should set multiple keys with their values using pipelines', async () => {
        const keyValuePairs: [string, any][] = [
          ['key1', 'value1'],
          ['key2', { name: 'Test', age: 30 }]
        ];
        const ttl = 3600;
        await service.setMultiple(keyValuePairs, ttl);

        expect(redisClient.pipeline().set).toHaveBeenNthCalledWith(
          1,
          `${prefix}key1`,
          JSON.stringify('value1'), // Ajustez l'attente pour inclure les guillemets
          'EX',
          ttl
        );
        expect(redisClient.pipeline().set).toHaveBeenNthCalledWith(
          2,
          `${prefix}key2`,
          JSON.stringify({ name: 'Test', age: 30 }), // L'objet est sérialisé en JSON
          'EX',
          ttl
        );

        expect(redisClient.pipeline().exec).toHaveBeenCalled();
      });

      it('should handle errors in pipeline execution', async () => {
        const keyValuePairs: KeyValuePairs = [['key1', 'value1']];
        (redisClient.pipeline().exec as jest.Mock).mockImplementation(() => {
          throw new Error('Pipeline execution failed');
        });

        await expect(service.setMultiple(keyValuePairs)).rejects.toThrow(
          'Pipeline execution failed'
        );
      });
    });

    // Repeat for other methods
  });
});
