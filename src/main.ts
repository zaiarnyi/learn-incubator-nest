import { NestFactory } from '@nestjs/core';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
// import * as compression from 'compression';
import { HttpExceptionFilter } from './infrastructure/rest/http-exception.filter';
import { useContainer } from 'class-validator';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: true,
      logger: ['error', 'warn', 'log'],
    });
    const configService = app.get(ConfigService);
    const PORT = +configService.get('PORT', '3005');

    app.enableCors();
    app.use(helmet());
    //  app.use(compression());
    app.use(cookieParser());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
      }),
    );

    app.use(
      rateLimit({
        windowMs: 1000 * 10,
        max: 5, // 1000 requests per windowMs
        message: '⚠️ Too many request created from this IP, please try again after an hour',
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        stopAtFirstError: true,
        // errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        transformOptions: { enableImplicitConversion: true },
        exceptionFactory: (errors) => {
          const err = errors.map((item) => ({
            message: Object.values(item.constraints)[0],
            field: item.property,
          }));
          throw new BadRequestException(err);
        },
      }),
    );
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(PORT);

    Logger.log(`Server is listening on port ${PORT}`, 'Bootstrap');
  } catch (e) {
    Logger.error(`❌ Error starting server, ${e}`, '', 'Bootstrap', false);
  }
}

bootstrap();
