import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async set(key: string, value: string, ttl: number): Promise<string> {
    await this.redisClient.set(key, value, 'EX', ttl);
    return `Data set for key: ${key}`;
  }

  async get(key: string): Promise<string | null> {
    const value = await this.redisClient.get(key);
    if (value) {
      console.log(`Retrieved value from cache: ${value}`);
    } else {
      console.log(`No value found in cache for key: ${key}`);
    }
    return value;
  }

  async del(key: string): Promise<number> {
    const result = await this.redisClient.del(key);
    console.log(`Deleted key from cache: ${key}, result: ${result}`);
    return result; // Returns the number of keys that were removed.
  }
}
