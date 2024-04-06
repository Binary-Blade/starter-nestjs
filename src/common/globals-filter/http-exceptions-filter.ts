import { NODE_ENV, PROD_ENV } from '@common/constants';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

/**
 * A global exception filter that catches all HTTP exceptions and formats
 * the response to include helpful debugging information in non-production environments.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private configService: ConfigService) {}

  /**
   * Method to catch and handle HTTP exceptions.
   *
   * @param exception The caught HttpException.
   * @param host The arguments host containing information about the request context.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Construct the error response object.
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message || null
    };

    // Include additional debugging information in non-production environments.
    if (this.configService.get<string>(NODE_ENV) !== PROD_ENV) {
      errorResponse['path'] = request.url;
      errorResponse['method'] = request.method;
      errorResponse['stack'] = exception.stack;
    }

    // Log the error message and send the response.
    this.logger.error(`Http Status: ${status}, Exception Message: ${exception.message}`);
    response.status(status).json(errorResponse);
  }
}
