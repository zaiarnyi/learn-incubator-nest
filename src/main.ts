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
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      cors: true,
      logger: ['error', 'warn', 'log'],
    });
    const configService = app.get(ConfigService);
    const PORT = +configService.get('PORT', '3005');
    app.useStaticAssets(join(__dirname, '..', 'client'));
    app.enableCors();
    app.set('trust proxy', true);
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
        max: 1000, // 1000 requests per windowMs
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

    const config = new DocumentBuilder()
      .setTitle('Ты лучший')
      .setDescription('ТЫ скоро устроишься на работу')
      .setVersion('1.0')
      .addTag('auth', 'All methods for user')
      .addTag('blogs', 'All methods for blogs')
      .addTag('posts', 'All methods for posts')
      .addTag('comments', 'All methods for comments')
      .addTag('pair-game-quiz', 'All methods for quiz')
      .addTag('security', 'All methods for security')
      .addTag('blogger', 'All methods for blogger')
      .addTag('sa/users', 'All methods for super admin/users')
      .addTag('sa/quiz/questions', 'All methods for super admin/quiz/questions')
      .addTag('sa/blogs', 'All methods for super admin/blogs')
      .addTag('integrations', 'All methods for integrations')
      .addBearerAuth({ type: 'http' })
      .addCookieAuth('refreshToken')
      .addBasicAuth({ type: 'http' })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.use(express.static('public'));
    SwaggerModule.setup('api', app, document);
    await app.listen(PORT);

    Logger.log(`Server is listening on port ${PORT}`, 'Bootstrap');
  } catch (e) {
    Logger.error(`❌ Error starting server, ${e}`, '', 'Bootstrap', false);
  }
}

bootstrap();
