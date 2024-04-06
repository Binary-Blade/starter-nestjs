import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@modules/users/users.module';
import { RedisModule } from '@database/redis/redis.module';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@security/auth/auth.module';
/**
 * Main application module
 *
 * @class AppModule class (module) for the main application
 * @method imports Import the necessary modules for this application
 * @returns AppModule
 */
@Module({
  imports: [
    // Global configuration module that loads environment variables.
    ConfigModule.forRoot({ envFilePath: './.env', isGlobal: true }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule
    // ThrollerModule  NOTE: Configure it to prevent abuse of the API instead of nginx if necessary.
  ]
})
export class AppModule {}
