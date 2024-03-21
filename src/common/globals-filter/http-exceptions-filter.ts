import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	constructor(private configService: ConfigService) { }

	catch(exception: HttpException, host: ArgumentsHost) {

		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>()
		const status = exception.getStatus();
		const errorResponse = {
			statusCode: status,
			timestamp: new Date().toISOString(),
			message: exception.message || null,
		};

		if (this.configService.get<string>('NODE_ENV') !== 'production') {
			errorResponse['path'] = request.url;
			errorResponse['method'] = request.method;
			errorResponse['stack'] = exception.stack;
		}

		this.logger.error(`Http Status: ${status}, Exception Message: ${exception.message}`);
		response.status(status).json(errorResponse)
	}

}


