import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigDatabase } from './infrastructure/database/configs/databases/mongo-config.database';
import { UsersModule } from './infrastructure/ioc/users.module';
import { PostsModule } from './infrastructure/ioc/posts.module';
import { BlogsModule } from './infrastructure/ioc/blogs.module';
import { CommentsModule } from './infrastructure/ioc/comments.module';
import { TestController } from './presentation/controllers/test.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: MongoConfigDatabase.connectionDB,
      inject: [ConfigService],
    }),
    UsersModule,
    PostsModule,
    BlogsModule,
    CommentsModule,
  ],
  controllers: [TestController],
  providers: [],
})
export class AppModule {}
