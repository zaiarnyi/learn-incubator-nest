import { Module } from '@nestjs/common';
import { PostsController } from '../../presentation/controllers/posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../../domain/posts/entities/post.entity';
import { MongoCollections } from '../database/mongo.collections';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';
import { CreatePostByBlogIdAction } from '../../application/actions/posts/create-post-by-blogId.action';
import { BlogsModule } from './blogs.module';
import { MainPostRepository } from '../database/repositories/posts/main-post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
        collection: MongoCollections.POSTS,
      },
    ]),
    BlogsModule,
  ],
  controllers: [PostsController],
  providers: [CreatePostAction, CreatePostByBlogIdAction, MainPostRepository],
  exports: [CreatePostByBlogIdAction],
})
export class PostsModule {}
