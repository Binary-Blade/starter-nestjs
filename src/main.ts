import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@common/globals-filter/http-exceptions-filter';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
// import { runMigrations } from '@config/database/migration-runner';
// Import the runMigrations function if you decide to uncomment it

/**
 * The entry point of the NestJS application. It sets up and configures the application
 * environment, including global middleware, pipes, and filters.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Retrieve the ConfigService instance to access environment variables and application configuration.
  const configService = app.get(ConfigService);

  // Use helmet middleware for setting various HTTP headers to secure the app.
  app.use(helmet());
  // Use a global validation pipe for automatically validating DTOs (Data Transfer Objects).
  app.useGlobalPipes(new ValidationPipe());
  // Use a global exception filter for handling HTTP exceptions in a standardized way.
  app.useGlobalFilters(new HttpExceptionFilter(configService));

  // Optionally, run database migrations automatically on application startup.
  // This line is commented out by default. Uncomment it to enable automatic migration on startup.
  // await runMigrations();
  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();

