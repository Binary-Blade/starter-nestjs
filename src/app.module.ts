import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@modules/users/users.module';
import { RedisModule } from '@database/redis/redis.module';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@security/auth/auth.module';
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
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule

    // NOTE: Configure it to prevent abuse of the API instead of nginx if necessary.
    // ThrollerModule
  ]
})
export class AppModule {}
