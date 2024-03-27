import { Logger } from '@nestjs/common';
import datasource from './typeorm-cli.config';

/**
 * Executes database migrations using the TypeORM CLI configuration.
 * This function initializes the data source and runs all pending migrations.
 * It is intended to be used at the application startup to ensure the database schema is up to date.
 */
export async function runMigrations() {
  const logger = new Logger('migrationRunner');

  try {
    logger.log('Running migration...');
    await datasource.initialize();
    await datasource.runMigrations();
  } catch (err) {
    logger.error('Cannot start the app. Migration have failed!', err);
    process.exit(1); // Exiting with a non-zero code to indicate failure
  }
}
