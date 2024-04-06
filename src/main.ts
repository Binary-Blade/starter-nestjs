import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@common/globals-filter/http-exceptions-filter';
import { WinstonLoggerService } from '@common/logger/winston.service';
import { ConfigService } from '@nestjs/config';

/**
 * Bootstrap the application
 *
 * @returns void
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLoggerService() // Custom Winston logger
  });

  const configService = app.get(ConfigService);

  // Enable CORS for the frontend URL
  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept'
  });

  // Middleware for parsing cookies and setting security headers
  app.use(cookieParser());
  app.use(helmet());

  // Globally applied pipes, filters, and interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      //transform: true, // Automatically transform payloads to DTO instances
      whitelist: true // Strip non-whitelisted properties
    })
  );

  // Globally applied filter and interceptor
  app.useGlobalFilters(new HttpExceptionFilter(configService));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Listening on a port defined in the environment or a default
  await app.listen(configService.get('PORT', 3000));
}

bootstrap();
