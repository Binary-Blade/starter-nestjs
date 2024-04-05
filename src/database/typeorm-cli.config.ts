import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables from .env file into process.env
config();
const configService = new ConfigService();

/**
 * Configures and creates a new TypeORM DataSource.
 * This configuration is intended to set up database connectivity parameters
 * using environment variables loaded by the ConfigService and dotenv.
 *
 * The DataSource includes configurations for database connection, entities, and migrations.
 * Entities and migrations paths are set to load automatically from specified directories.
 */
export default new DataSource({
  type: 'postgres', // Database type
  host: configService.get<string>('DB_HOST'), // Database host
  port: configService.get<number>('DB_PORT'), // Database port
  database: configService.get<string>('DB_NAME'), // Database name
  username: configService.get<string>('DB_USERNAME'), // Database username
  password: configService.get<string>('DB_PASSWORD'), // Database password
  entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'], // Entities path
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'] // Migrations path
});
