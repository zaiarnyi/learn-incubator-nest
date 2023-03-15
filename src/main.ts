import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './infrastructure/rest/http-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const PORT = configService.get('PORT', '3005');

    app.use(helmet());
    app.use(compression());
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
        windowMs: 1000 * 60 * 60,
        max: 1000, // 1000 requests per windowMs
        message: '⚠️ Too many request created from this IP, please try again after an hour',
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        // errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        // transformOptions: { enableImplicitConversion: true },
      }),
    );

    await app.listen(PORT);
    Logger.log(`Server is listening on port ${PORT}`, 'Bootstrap');
  } catch (e) {
    Logger.error(`❌ Error starting server, ${e}`, '', 'Bootstrap', false);
  }
}

bootstrap();
