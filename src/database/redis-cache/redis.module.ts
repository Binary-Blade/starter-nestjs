import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [ConfigModule], // Make sure to import the ConfigModule if using ConfigService
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) =>
        new Redis({
          host: configService.get('REDIS_HOST'), // Default to 'localhost' if not defined
          port: configService.get('REDIS_PORT') // Default to 6379 if not defined
          // Include additional Redis options here if necessary
        }),
      inject: [ConfigService] // Ensure ConfigService is injected
    },
    RedisService
  ],
  exports: ['REDIS_CLIENT', RedisService]
})
export class RedisModule {}
