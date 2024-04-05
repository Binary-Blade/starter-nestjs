import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async setData(key: string, value: string): Promise<string> {
    await this.redisClient.set(key, value, 'EX', 60); // Set key to expire in 60 seconds
    return `Data set for key: ${key}`;
  }

  async getData(key: string): Promise<string | null> {
    const value = await this.redisClient.get(key);
    if (value) {
      console.log(`Retrieved value from cache: ${value}`);
    } else {
      console.log(`No value found in cache for key: ${key}`);
    }
    return value;
  }

  async deleteData(key: string): Promise<number> {
    const result = await this.redisClient.del(key);
    console.log(`Deleted key from cache: ${key}, result: ${result}`);
    return result; // Returns the number of keys that were removed.
  }
}
