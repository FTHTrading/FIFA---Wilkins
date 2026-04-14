import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const requestId = req.headers?.['x-request-id'] ?? '-';
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const statusCode = res.statusCode ?? 200;
          const duration = Date.now() - start;
          this.logger.log(`${method} ${url} ${statusCode} ${duration}ms [${requestId}]`);
        },
        error: (err) => {
          const duration = Date.now() - start;
          const status = err?.status ?? 500;
          this.logger.warn(`${method} ${url} ${status} ${duration}ms [${requestId}] ${err?.message ?? ''}`);
        },
      }),
    );
  }
}
