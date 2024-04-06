import { DEV_PREFIX, NODE_ENV, PROD_ENV, PROD_PREFIX } from '@common/constants';
import { KeyValuePairs } from '@common/interfaces/key-value-redis.interface';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Redis service for interacting with Redis cache
 *
 * @class RedisService class (provider) for interacting with Redis cache
 * @method set Set data in Redis cache
 * @method get Get data from Redis cache
 * @method del Delete data from Redis cache
 * @method setMultiple Set multiple key-value pairs in Redis cache
 * @method formatKey Format key with prefix
 */
@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly keyPrefix: string;

  /**
   * Constructor for RedisService class
   *
   * @param redisClient Redis client
   * @param configService ConfigService instance
   */
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {
    // Set key prefix based on environment
    this.keyPrefix =
      this.configService.get<string>(NODE_ENV) === PROD_ENV ? PROD_PREFIX : DEV_PREFIX;
  }

  /**
   * Set data in Redis cache
   *
   * @param key Key to set data against
   * @param value Value to set
   * @param ttl Time to live for the key
   * @returns Success message
   */
  async set(key: string, value: any, ttl?: number): Promise<string> {
    if (!key) throw new Error('Key is required');

    const fullKey = this.formatKey(key);
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (typeof ttl === 'number') {
      await this.redisClient.set(fullKey, stringValue, 'EX', ttl);
    } else {
      await this.redisClient.set(fullKey, stringValue);
    }
    return `Data set for key: ${fullKey}`;
  }

  /**
   * Get data from Redis cache
   *
   * @param key Key to get data for
   * @returns Value for the key
   */
  async get(key: string): Promise<string | null> {
    if (!key) throw new Error('Key is required');

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

  /**
   * Get data from Redis cache
   *
   * @param key Key to get data for
   * @returns Value for the key
   */
  async del(key: string): Promise<string> {
    if (!key) throw new Error('Key is required');

    const fullKey = this.formatKey(key);
    const result = await this.redisClient.del(fullKey);
    if (!result) {
      this.logger.warn(`Key not found in cache: ${fullKey}`);
      return `Key not found: ${fullKey}`;
    }
    return `Key deleted: ${fullKey}`;
  }

  /**
   * Set multiple key-value pairs in Redis cache
   *
   * @param keyValuePairs Key-value pairs to set
   * @param ttl Time to live for the keys
   * @returns Success message
   */
  async setMultiple(keyValuePairs: KeyValuePairs, ttl?: number): Promise<void> {
    const pipeline = this.redisClient.pipeline();
    keyValuePairs.forEach(([key, value]) => {
      const fullKey = this.formatKey(key);
      const stringValue = JSON.stringify(value);
      if (typeof ttl === 'number') {
        pipeline.set(fullKey, stringValue, 'EX', ttl);
      } else {
        pipeline.set(fullKey, stringValue);
      }
    });
    await pipeline.exec();
  }

  /**
   * Get data from Redis cache
   *
   * @param keys Keys to get data for
   * @returns Values for the keys
   */
  private formatKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }
}
