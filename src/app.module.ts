import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'), // Database host
          port: config.get<number>('DB_PORT'), // Database port
          username: config.get<string>('DB_USERNAME'), // Database username
          password: config.get<string>('DB_PASSWORD'), // Database password
          database: config.get<string>('DB_NAME'), // Database name
          // NOTE: Dont forget to turn of synchronize in production mode
          synchronize: config.get<boolean>('DB_SYNCHRONIZE'), // Synchronize the database state with the models on application startup
          entities: [User], // Path entities
        };
      },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }