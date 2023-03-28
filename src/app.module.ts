import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigDatabase } from './infrastructure/database/configs/databases/mongo-config.database';
import { UsersModule } from './infrastructure/ioc/users.module';
// import { PostsModule } from './infrastructure/ioc/posts.module';
// import { BlogsModule } from './infrastructure/ioc/blogs.module';
// import { CommentsModule } from './infrastructure/ioc/comments.module';
// import { TestController } from './presentation/controllers/test.controller';
import { CacheService } from './infrastructure/cache';
// import { APP_FILTER } from '@nestjs/core';
// import { HttpExceptionFilter } from './infrastructure/rest/http-exception.filter';
// import { AuthModule } from './infrastructure/ioc/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useClass: MongoConfigDatabase,
    }),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    UsersModule,
    // PostsModule,
    // BlogsModule,
    // CommentsModule,
    // AuthModule,
  ],
  controllers: [],
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: HttpExceptionFilter,
  //   },
  // ],
})
export class AppModule {}
