import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryCommentsRepository } from '../../../infrastructure/database/repositories/comments/query-comments.repository';
import { plainToClass } from 'class-transformer';
import { CommentResponse } from '../../../presentation/responses/commentById.response';
import { QueryLikeStatusRepository } from '../../../infrastructure/database/repositories/comments/like-status/query-like-status.repository';
import { ExtendedLikesInfo } from '../../../presentation/responses/extendedLikesInfo.response';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { QueryUserBannedRepository } from '../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';

@Injectable()
export class GetCommentByIdAction {
  private logger = new Logger(GetCommentByIdAction.name);

  constructor(
    @Inject(QueryCommentsRepository) private readonly queryRepository: QueryCommentsRepository,
    @Inject(QueryLikeStatusRepository) private readonly queryLikeStatusRepository: QueryLikeStatusRepository,
    @Inject(QueryUserBannedRepository) private readonly queryUserBannedRepository: QueryUserBannedRepository,
  ) {}

  private async validateIsUserBanned(userId: number) {
    if (!userId) return;
    const hasBanned = await this.queryUserBannedRepository.checkStatus(userId);
    if (hasBanned) {
      throw new NotFoundException();
    }
  }

  private async getLikesInfo(commentId: number, userId?: number): Promise<ExtendedLikesInfo> {
    const [likesCount, dislikesCount, info] = await Promise.all([
      this.queryLikeStatusRepository.getCountLikesByCommentId(commentId, 'like'),
      this.queryLikeStatusRepository.getCountLikesByCommentId(commentId, 'dislike'),
      userId && this.queryLikeStatusRepository.getMyStatusByCommentId(commentId, userId),
    ]);
    return plainToClass(ExtendedLikesInfo, {
      likesCount,
      dislikesCount,
      myStatus: info?.my_status ?? LikeStatusEnum.None,
    });
  }

  public async execute(id: number, userId?: number): Promise<CommentResponse> {
    await this.validateIsUserBanned(userId);
    const comment = await this.queryRepository.getCommentById(id).catch((e) => {
      this.logger.error(`An error occurred when receiving comments with id - ${id}. ${JSON.stringify(e, null, 2)}`);
      throw new NotFoundException();
      return e;
    });

    if (!comment || comment.is_banned) {
      throw new NotFoundException();
    }
    console.log(comment, 'comment');
    return plainToClass(CommentResponse, {
      ...comment,
      id: comment.commentId.toString(),
      commentatorInfo: {
        userId: comment.user.toString(),
        userLogin: comment.login,
      },
      likesInfo: await this.getLikesInfo(id, userId),
    });
  }
}
