import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let message;
    if (status === HttpStatus.BAD_REQUEST) {
      const res: any = exception.getResponse();
      message = { errorsMessages: res.message };
    } else {
      message = exception.message;
    }
    response.status(status).json(message);
  }
}
