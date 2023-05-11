import { forwardRef, Module } from '@nestjs/common';
import { CommentsController } from '../../presentation/controllers/comments.controller';
import { QueryCommentsRepository } from '../database/repositories/comments/query-comments.repository';
import { GetCommentByIdAction } from '../../application/actions/comments/getCommentById.action';
import { MainCommentsRepository } from '../database/repositories/comments/main-comments.repository';
import { ChangeCommentByIdAction } from '../../application/actions/comments/change-comment-by-id.action';
import { DeleteCommentByIdAction } from '../../application/actions/comments/delete-comment-by-id.action';
import { ChangeLikeStatusByCommentIdAction } from '../../application/actions/comments/change-like-status-by-commentId.action';
import { MainLikeStatusRepository } from '../database/repositories/comments/like-status/main-like-status.repository';
import { QueryLikeStatusRepository } from '../database/repositories/comments/like-status/query-like-status.repository';
import { PostsModule } from './posts.module';
import { SaUsersModule } from './sa/users/sa-users.module';

@Module({
  imports: [forwardRef(() => PostsModule), SaUsersModule],
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
  exports: [MainCommentsRepository, MainLikeStatusRepository, QueryLikeStatusRepository, QueryCommentsRepository],
})
export class CommentsModule {}
