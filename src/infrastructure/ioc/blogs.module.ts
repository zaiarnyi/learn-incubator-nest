import { forwardRef, Module } from '@nestjs/common';
import { BlogsController } from '../../presentation/controllers/blogs.controller';
import { MainBlogsRepository } from '../database/repositories/blogs/main-blogs.repository';
import { GetBlogByIdAction } from '../../application/actions/blogs/getBlogById.action';
import { QueryBlogsRepository } from '../database/repositories/blogs/query-blogs.repository';
import { GetAllBlogsAction } from '../../application/actions/blogs/get-all-blogs.action';
import { PostsModule } from './posts.module';
import { GetPostByBlogIdAction } from '../../application/actions/blogs/getPostByBlogId.action';
import { UsersModule } from './users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from '../../domain/blogs/entities/blog.entity';
import { BlogImagesEntity } from '../../domain/blogs/entities/blog-images.entity';
import { SubscriptionBlogAction } from '../../application/actions/blogs/subscription-blog.action';
import { UnsubscriptionBlogAction } from '../../application/actions/blogs/unsubscription-blog.action';
import { SubscriptionUsersBlogsEntity } from '../../domain/blogs/entities/subscription-users-blogs.entity';

@Module({
  imports: [
    forwardRef(() => PostsModule),
    UsersModule,
    TypeOrmModule.forFeature([BlogEntity, BlogImagesEntity, SubscriptionUsersBlogsEntity]),
  ],
  controllers: [BlogsController],
  providers: [
    MainBlogsRepository,
    GetBlogByIdAction,
    QueryBlogsRepository,
    GetAllBlogsAction,
    GetPostByBlogIdAction,
    SubscriptionBlogAction,
    UnsubscriptionBlogAction,
  ],
  exports: [QueryBlogsRepository, MainBlogsRepository, GetAllBlogsAction],
})
export class BlogsModule {}
