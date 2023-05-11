import { forwardRef, Module } from '@nestjs/common';
import { BlogsController } from '../../presentation/controllers/blogs.controller';
import { MainBlogsRepository } from '../database/repositories/blogs/main-blogs.repository';
import { GetBlogByIdAction } from '../../application/actions/blogs/getBlogById.action';
import { QueryBlogsRepository } from '../database/repositories/blogs/query-blogs.repository';
import { GetAllBlogsAction } from '../../application/actions/blogs/get-all-blogs.action';
import { PostsModule } from './posts.module';
import { GetPostByBlogIdAction } from '../../application/actions/blogs/getPostByBlogId.action';
import { UsersModule } from './users.module';

@Module({
  imports: [forwardRef(() => PostsModule), UsersModule],
  controllers: [BlogsController],
  providers: [MainBlogsRepository, GetBlogByIdAction, QueryBlogsRepository, GetAllBlogsAction, GetPostByBlogIdAction],
  exports: [QueryBlogsRepository, MainBlogsRepository, GetAllBlogsAction],
})
export class BlogsModule {}
