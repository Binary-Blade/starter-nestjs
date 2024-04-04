import { Injectable, LoggerService } from '@nestjs/common';
import { logger } from './winston.config'; // Import your winston logger setup

@Injectable()
export class WinstonLoggerService implements LoggerService {
  log(message: string) {
    logger.info(message);
  }

  error(message: string, trace: string) {
    logger.error(message, { trace });
  }

  warn(message: string) {
    logger.warn(message);
  }

  debug(message: string) {
    logger.debug(message);
  }

  verbose(message: string) {
    logger.verbose(message);
  }
}
