import { DEV_PREFIX, NODE_ENV, PROD_ENV, PROD_PREFIX } from '@common/constants';
import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly keyPrefix: string;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {
    this.keyPrefix =
      this.configService.get<string>(NODE_ENV) === PROD_ENV ? PROD_PREFIX : DEV_PREFIX;
  }

  private formatKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  async set(key: string, value: any, ttl?: number): Promise<string> {
    const fullKey = this.formatKey(key);
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (typeof ttl === 'number') {
      await this.redisClient.set(fullKey, stringValue, 'EX', ttl);
    } else {
      await this.redisClient.set(fullKey, stringValue);
    }
    return `Data set for key: ${fullKey}`;
  }

  async get(key: string): Promise<string | null> {
    const fullKey = this.formatKey(key);
    try {
      const value = await this.redisClient.get(fullKey);
      if (!value) return null;
      return value;
    } catch (error) {
      this.logger.error(`Error retrieving key ${fullKey} from cache`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    const fullKey = this.formatKey(key);
    const result = await this.redisClient.del(fullKey);
    if (!result) {
      this.logger.warn(`Key not found in cache: ${fullKey}`);
      throw new NotFoundException(`Key not found in cache: ${fullKey}`);
    }
    return result;
  }
}
