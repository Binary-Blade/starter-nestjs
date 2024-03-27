import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';

/**
 * The root module of the application. It bundles all feature modules and
 * global configurations like environment variables and database setup.
 */
@Module({
  imports: [
    // Global configuration module that loads environment variables.
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true
    }),
    // Asynchronous database module initialization with configurations from the ConfigModule.
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
        synchronize: config.get<boolean>('DB_SYNCHRONIZE'), // Auto-sync database schema.
        entities: [__dirname + '/**/*.entity{.ts,.js}'] // Entities path.
      })
    }),
    // Feature modules.
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
