import { Module } from '@nestjs/common';
import { PostsController } from '../../presentation/controllers/posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../../domain/posts/entities/post.entity';
import { MongoCollections } from '../database/mongo.collections';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
        collection: MongoCollections.POSTS,
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [CreatePostAction],
  exports: [],
})
export class PostsModule {}
