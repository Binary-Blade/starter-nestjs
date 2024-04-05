import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres', // The database type.
        host: config.get<string>('DB_HOST'), // Database host.
        port: config.get<number>('DB_PORT'), // Database port.
        username: config.get<string>('DB_USERNAME'), // Database username.
        password: config.get<string>('DB_PASSWORD'), // Database password.
        database: config.get<string>('DB_NAME'), // Database name.
        synchronize: false, // Auto-sync database schema if set to true. NOTE: Switch to true in production mode
        entities: [__dirname + '/**/*.entity{.ts,.js}'] // Entities path.
      })
    })
  ]
})
export class DatabaseModule {}
