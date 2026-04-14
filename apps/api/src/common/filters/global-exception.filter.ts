import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');
  private readonly isProduction = process.env.NODE_ENV === 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const requestId = request?.headers?.['x-request-id'] ?? '-';

    if (status >= 500) {
      this.logger.error(
        `${request?.method} ${request?.url} ${status} [${requestId}]`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    // In production, never expose internal error details for 5xx
    let message: string | object;
    if (exception instanceof HttpException) {
      const exResponse = exception.getResponse();
      // For 5xx in production, mask the message
      if (this.isProduction && status >= 500) {
        message = 'Internal server error';
      } else {
        message = exResponse;
      }
    } else {
      message = this.isProduction ? 'Internal server error' : String(exception);
    }

    const body = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request?.url,
      requestId,
      ...(typeof message === 'string' ? { message } : (message as object)),
    };

    response.status(status).send(body);
  }
}
