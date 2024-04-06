import { Injectable, LoggerService } from '@nestjs/common';
import { logger } from './winston.config'; // Import your winston logger setup

/**
 * Provides a logger that integrates with Winston.
 */

@Injectable()
export class WinstonLoggerService implements LoggerService {
  /**
   * Log a message with the info level.
   *
   * @param message The message to log
   */
  log(message: string) {
    logger.info(message);
  }

  /**
   * Log a message with the error level.
   *
   * @param message The message to log
   * @param trace The stack trace
   */
  error(message: string, trace: string) {
    logger.error(message, { trace });
  }

  /**
   * Log a message with the warn level.
   *
   * @param message The message to log
   */
  warn(message: string) {
    logger.warn(message);
  }

  /**
   * Log a message with the debug level.
   *
   * @param message The message to log
   */
  debug(message: string) {
    logger.debug(message);
  }

  /**
   * Log a message with the verbose level.
   *
   * @param message The message to log
   */
  verbose(message: string) {
    logger.verbose(message);
  }
}
