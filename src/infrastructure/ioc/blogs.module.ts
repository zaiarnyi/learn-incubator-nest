import { forwardRef, Module } from '@nestjs/common';
import { BlogsController } from '../../presentation/controllers/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from '../../domain/blogs/entities/blog.entity';
import { MongoCollections } from '../database/mongo.collections';
import { CreateBlogAction } from '../../application/actions/blogs/create-blog.action';
import { MainBlogsRepository } from '../database/repositories/blogs/main-blogs.repository';
import { GetBlogByIdAction } from '../../application/actions/blogs/getBlogById.action';
import { QueryBlogsRepository } from '../database/repositories/blogs/query-blogs.repository';
import { UpdateBlogAction } from '../../application/actions/blogs/update-blog.action';
import { DeleteBlogByIdAction } from '../../application/actions/blogs/delete-blogById.action';
import { GetAllBlogsAction } from '../../application/actions/blogs/get-all-blogs.action';
import { PostsModule } from './posts.module';
import { Post, PostSchema } from '../../domain/posts/entities/post.entity';
import { GetPostByBlogIdAction } from '../../application/actions/blogs/getPostByBlogId.action';
import { UsersModule } from './users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
        collection: MongoCollections.BLOGS,
      },
      {
        name: Post.name,
        schema: PostSchema,
        collection: MongoCollections.POSTS,
      },
    ]),
    forwardRef(() => PostsModule),
    UsersModule,
  ],
  controllers: [BlogsController],
  providers: [
    CreateBlogAction,
    MainBlogsRepository,
    GetBlogByIdAction,
    QueryBlogsRepository,
    UpdateBlogAction,
    DeleteBlogByIdAction,
    GetAllBlogsAction,
    GetPostByBlogIdAction,
  ],
  exports: [QueryBlogsRepository, MainBlogsRepository],
})
export class BlogsModule {}
