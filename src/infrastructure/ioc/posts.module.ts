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
import { Comment, CommentSchema } from '../../domain/comments/entities/comment.entity';
import { GetCommentsByPostIdAction } from '../../application/actions/posts/get-comments-by-postId.action';
import { QueryCommentsRepository } from '../database/repositories/comments/query-comments.repository';
import { LikeStatusPosts, LikeStatusPostsSchema } from '../../domain/posts/like-status/entity/like-status-posts.entity';
import { ChangeLikeStatusPostAction } from '../../application/actions/posts/change-like-status.action';
import { QueryLikeStatusPostRepository } from '../database/repositories/posts/like-status/query-like-status-post.repository';
import { MainLikeStatusPostRepository } from '../database/repositories/posts/like-status/main-like-status-post.repository';
import { UsersModule } from './users.module';
import { GetLikesInfoForPostService } from '../../application/services/posts/get-likes-info-for-post.service';
import { CreateCommentForPostAction } from '../../application/actions/posts/create-comment-for-post.action';
import { CommentsModule } from './comments.module';
import { ValidateBlogByIdValidator } from '../validators/validateBlogById.validator';
import { BlogsModule } from './blogs.module';

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
      {
        name: LikeStatusPosts.name,
        schema: LikeStatusPostsSchema,
        collection: MongoCollections.POST_LIKE_STATUSES,
      },
      {
        name: Comment.name,
        schema: CommentSchema,
        collection: MongoCollections.COMMENTS,
      },
    ]),
    UsersModule,
    CommentsModule,
    BlogsModule,
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
    ChangeLikeStatusPostAction,
    QueryLikeStatusPostRepository,
    MainLikeStatusPostRepository,
    GetLikesInfoForPostService,
    CreateCommentForPostAction,
    ValidateBlogByIdValidator,
  ],
  exports: [CreatePostAction, MainPostRepository, MainLikeStatusPostRepository, QueryPostRepository],
})
export class PostsModule {}
