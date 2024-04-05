import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<string> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (typeof ttl === 'number') {
      await this.redisClient.set(key, stringValue, 'EX', ttl);
    } else {
      await this.redisClient.set(key, stringValue);
    }
    return `Data set for key: ${key}`;
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.redisClient.get(key);
      if (!value) return null;
      return value;
    } catch (error) {
      this.logger.error(`Error retrieving key ${key} from cache`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    const result = await this.redisClient.del(key);
    if (!result) {
      throw new NotFoundException(`Key not found in cache: ${key}`);
    }
    return result;
  }
}
