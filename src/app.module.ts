import { CacheModule, Module } from '@nestjs/common';
import { UsersModule } from './infrastructure/ioc/users.module';
import { PostsModule } from './infrastructure/ioc/posts.module';
import { BlogsModule } from './infrastructure/ioc/blogs.module';
import { CommentsModule } from './infrastructure/ioc/comments.module';
import { TestController } from './presentation/controllers/test.controller';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './infrastructure/rest/http-exception.filter';
import { AuthModule } from './infrastructure/ioc/auth.module';
import { SecurityModule } from './infrastructure/ioc/security.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { BloggerModule } from './infrastructure/ioc/blogger.module';
import { CacheService } from './infrastructure/cache';
import { SaModule } from './infrastructure/ioc/sa/sa.module';
import { LoggerInterceptor } from './infrastructure/interseptor/logger.interseptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresqlConfigDatabase } from './infrastructure/database/configs/databases/postgresql-config.database';
import { PairsModule } from './infrastructure/ioc/pairs.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { RedisConfig } from './infrastructure/database/configs/redis.config';
import { IntegrationModule } from './infrastructure/ioc/integration.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresqlConfigDatabase,
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    ThrottlerModule.forRoot({
      ttl: 3600,
      limit: 1000,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    BullModule.forRootAsync({
      useClass: RedisConfig,
    }),
    BloggerModule,
    UsersModule,
    PostsModule,
    BlogsModule,
    CommentsModule,
    AuthModule,
    SecurityModule,
    SaModule,
    PairsModule,
    IntegrationModule,
  ],
  controllers: [TestController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
