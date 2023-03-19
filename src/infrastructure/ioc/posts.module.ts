import { Module } from '@nestjs/common';
import { PostsController } from '../../presentation/controllers/posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../../domain/posts/entities/post.entity';
import { MongoCollections } from '../database/mongo.collections';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';
import { MainPostRepository } from '../database/repositories/posts/main-post.repository';
import { Blog, BlogSchema } from '../../domain/blogs/entities/blog.entity';
import { QueryPostRepository } from '../database/repositories/posts/query-post.repository';
import { GetPostByIdAction } from '../../application/actions/posts/get-post-by-id.action';
import { UpdatePostAction } from '../../application/actions/posts/update-post.action';
import { DeletePostAction } from '../../application/actions/posts/delete-post.action';
import { GetPostsAction } from '../../application/actions/posts/get-posts.action';
import { CommentSchema, Comment } from '../../domain/comments/entities/comment.entity';
import { GetCommentsByPostIdAction } from '../../application/actions/posts/get-comments-by-postId.action';
import { QueryCommentsRepository } from '../database/repositories/comments/query-comments.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
        collection: MongoCollections.POSTS,
      },
      {
        name: Blog.name,
        schema: BlogSchema,
        collection: MongoCollections.BLOGS,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
        collection: MongoCollections.BLOGS,
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [
    CreatePostAction,
    MainPostRepository,
    QueryPostRepository,
    GetPostByIdAction,
    UpdatePostAction,
    DeletePostAction,
    GetPostsAction,
    GetCommentsByPostIdAction,
    QueryCommentsRepository,
  ],
  exports: [CreatePostAction, MainPostRepository],
})
export class PostsModule {}
