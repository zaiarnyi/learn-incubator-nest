import { forwardRef, Module } from '@nestjs/common';
import { CommentsController } from '../../presentation/controllers/comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '../../domain/comments/entities/comment.entity';
import { MongoCollections } from '../database/mongo.collections';
import { QueryCommentsRepository } from '../database/repositories/comments/query-comments.repository';
import { GetCommentByIdAction } from '../../application/actions/comments/getCommentById.action';
import { MainCommentsRepository } from '../database/repositories/comments/main-comments.repository';
import { ChangeCommentByIdAction } from '../../application/actions/comments/change-comment-by-id.action';
import { DeleteCommentByIdAction } from '../../application/actions/comments/delete-comment-by-id.action';
import { ChangeLikeStatusByCommentIdAction } from '../../application/actions/comments/change-like-status-by-commentId.action';
import {
  LikeStatusComment,
  LikeStatusCommentSchema,
} from '../../domain/comments/like-status/entity/like-status-comments.entity';
import { MainLikeStatusRepository } from '../database/repositories/comments/like-status/main-like-status.repository';
import { QueryLikeStatusRepository } from '../database/repositories/comments/like-status/query-like-status.repository';
import { PostsModule } from './posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
        collection: MongoCollections.COMMENTS,
      },
      {
        name: LikeStatusComment.name,
        schema: LikeStatusCommentSchema,
        collection: MongoCollections.COMMENT_LIKE_STATUSES,
      },
    ]),
    forwardRef(() => PostsModule),
  ],
  controllers: [CommentsController],
  providers: [
    QueryCommentsRepository,
    GetCommentByIdAction,
    MainCommentsRepository,
    ChangeCommentByIdAction,
    DeleteCommentByIdAction,
    ChangeLikeStatusByCommentIdAction,
    MainLikeStatusRepository,
    QueryLikeStatusRepository,
  ],
  exports: [MainCommentsRepository, MainLikeStatusRepository, QueryLikeStatusRepository],
})
export class CommentsModule {}
