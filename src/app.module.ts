import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigDatabase } from './infrastructure/database/configs/databases/mongo-config.database';
import { UsersModule } from './infrastructure/ioc/users.module';
import { PostsModule } from './infrastructure/ioc/posts.module';
import { BlogsModule } from './infrastructure/ioc/blogs.module';
import { CommentsModule } from './infrastructure/ioc/comments.module';
import { TestController } from './presentation/controllers/test.controller';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from './infrastructure/cache';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './infrastructure/rest/http-exception.filter';
import { AuthModule } from './infrastructure/ioc/auth.module';
import { SecurityModule } from './infrastructure/ioc/security.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useClass: MongoConfigDatabase,
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    ThrottlerModule.forRoot({
      ttl: 3600,
      limit: 1000,
    }),
    UsersModule,
    PostsModule,
    BlogsModule,
    CommentsModule,
    AuthModule,
    SecurityModule,
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
  ],
})
export class AppModule {}
