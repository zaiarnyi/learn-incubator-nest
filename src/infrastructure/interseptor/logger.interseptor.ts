import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const { statusCode } = context.switchToHttp().getResponse();
    const { originalUrl, method, params, query, body, headers } = req;
    const now = Date.now();
    const userId = req.user?.id;

    this.logger.log(
      'REQUEST: ' +
        JSON.stringify({
          userId,
          originalUrl,
          method,
          params,
          query,
          body,
          isAuth: /^Bearer/.test(headers?.authorization),
        }),
    );

    return next.handle().pipe(
      tap((data) => {
        console.log(data);
        this.logger.log(
          'RESPONSE: ' +
            JSON.stringify({
              userId,
              statusCode,
              data,
              time: Date.now() - now,
              isAuth: /^Bearer/.test(headers?.authorization),
            }),
        );
      }),
    );
  }
}
