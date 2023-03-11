import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const statusCode = exception.getStatus();

    if (statusCode !== HttpStatus.UNPROCESSABLE_ENTITY) {
      throw new HttpException(
        {
          // service: ,
          message: exception.message,
          timestamp: new Date().toISOString(),
        },
        statusCode,
      );
    }
    const exceptionResponse: any = exception.getResponse();

    throw new HttpException(
      {
        // service: ProductDataServiceName,
        message: exception.message,
        details: exceptionResponse.message,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    );
  }
}
