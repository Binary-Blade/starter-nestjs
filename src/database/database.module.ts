import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Database module for setting up TypeORM
 *
 * @class DatabaseModule class (module) for setting up TypeORM
 * @method forRootAsync Configure TypeORM based on environment
 * @returns TypeORM configuration
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        synchronize: false,
        entities: [__dirname + '/../**/*.entity{.ts,.js}']
      })
    })
  ]
})
export class DatabaseModule {}
