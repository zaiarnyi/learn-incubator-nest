import { Module } from '@nestjs/common';
import { PostsController } from '../../presentation/controllers/posts.controller';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';
import { MainPostRepository } from '../database/repositories/posts/main-post.repository';
import { QueryPostRepository } from '../database/repositories/posts/query-post.repository';
import { GetPostByIdAction } from '../../application/actions/posts/get-post-by-id.action';
import { UpdatePostAction } from '../../application/actions/posts/update-post.action';
import { DeletePostAction } from '../../application/actions/posts/delete-post.action';
import { GetPostsAction } from '../../application/actions/posts/get-posts.action';
import { GetCommentsByPostIdAction } from '../../application/actions/posts/get-comments-by-postId.action';
import { QueryCommentsRepository } from '../database/repositories/comments/query-comments.repository';
import { ChangeLikeStatusPostAction } from '../../application/actions/posts/change-like-status.action';
import { QueryLikeStatusPostRepository } from '../database/repositories/posts/like-status/query-like-status-post.repository';
import { MainLikeStatusPostRepository } from '../database/repositories/posts/like-status/main-like-status-post.repository';
import { UsersModule } from './users.module';
import { GetLikesInfoForPostService } from '../../application/services/posts/get-likes-info-for-post.service';
import { CreateCommentForPostAction } from '../../application/actions/posts/create-comment-for-post.action';
import { CommentsModule } from './comments.module';
import { ValidateBlogByIdValidator } from '../validators/validateBlogById.validator';
import { BlogsModule } from './blogs.module';
import { SaUsersModule } from './sa/users/sa-users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../../domain/posts/entities/post.entity';
import { CommentsEntity } from '../../domain/comments/entities/comment.entity';
import { PostLikesEntity } from '../../domain/posts/like-status/entity/like-status-posts.entity';
import { PostImagesEntity } from '../../domain/posts/entities/post-images.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CreatedPostListener } from '../../domain/posts/listeners/created-post.listener';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    SaUsersModule,
    UsersModule,
    CommentsModule,
    BlogsModule,
    TypeOrmModule.forFeature([PostEntity, CommentsEntity, PostLikesEntity, PostImagesEntity]),
    EventEmitterModule.forRoot(),
    HttpModule,
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
    CreatedPostListener,
  ],
  exports: [
    CreatePostAction,
    MainPostRepository,
    MainLikeStatusPostRepository,
    QueryPostRepository,
    GetLikesInfoForPostService,
  ],
})
export class PostsModule {}
