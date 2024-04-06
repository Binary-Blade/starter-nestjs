import { Logger } from '@nestjs/common';
import datasource from './typeorm-cli.config';

/**
 * Run migrations to update the database schema to the latest version
 * If migration fails, the app will not start
 *
 * @returns void
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
