import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GetCommentsByPostIdDto } from '../../../domain/posts/dto/get-comments-by-postId.dto';
import { QueryCommentsRepository } from '../../../infrastructure/database/repositories/comments/query-comments.repository';
import {
  GetCommentsByPostIdResponse,
  PostCommentInfo,
} from '../../../presentation/responses/posts/get-comments-by-postId.response';
import { plainToClass } from 'class-transformer';
import { QueryLikeStatusRepository } from '../../../infrastructure/database/repositories/comments/like-status/query-like-status.repository';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { CommentsEntity } from '../../../domain/comments/entities/comment.entity';
import { ExtendedLikesInfo } from '../../../presentation/responses/extendedLikesInfo.response';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';

@Injectable()
export class GetCommentsByPostIdAction {
  private logger = new Logger(GetCommentsByPostIdAction.name);
  constructor(
    @Inject(QueryCommentsRepository) private readonly queryRepository: QueryCommentsRepository,
    @Inject(QueryPostRepository) private readonly queryPostsRepository: QueryPostRepository,
    @Inject(QueryLikeStatusRepository) private readonly likeStatusCommentRepository: QueryLikeStatusRepository,
  ) {}

  private async validate(postId: number) {
    const post = await this.queryPostsRepository.getPostById(postId).catch((e) => {
      this.logger.error(e);
    });
    if (!post) {
      throw new NotFoundException();
    }
  }

  private async getLikesInfo(commentId: number, userId?: number): Promise<ExtendedLikesInfo> {
    const [likesCount, dislikesCount, info] = await Promise.all([
      this.likeStatusCommentRepository.getCountLikesByCommentId(commentId, 'like'),
      this.likeStatusCommentRepository.getCountLikesByCommentId(commentId, 'dislike'),
      userId && this.likeStatusCommentRepository.getMyStatusByCommentId(commentId, userId),
    ]);
    return {
      likesCount,
      dislikesCount,
      myStatus: info?.myStatus ?? LikeStatusEnum.None,
    };
  }

  public async execute(
    postId: number,
    query: GetCommentsByPostIdDto,
    userId?: number,
  ): Promise<GetCommentsByPostIdResponse> {
    await this.validate(postId);

    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const skip = (pageNumber - 1) * pageSize;

    const [commentsRaw, totalCount] = await this.queryRepository.getCommentByPostId(
      postId,
      skip,
      pageSize,
      sortBy,
      sortDirection,
    );
    const pagesCount = Math.ceil(totalCount / pageSize);
    const promises = commentsRaw.map(async (comment: CommentsEntity) => {
      return plainToClass(PostCommentInfo, {
        ...comment,
        id: comment.id.toString(),
        commentatorInfo: {
          userId: comment.user.id.toString(),
          userLogin: comment.user.login,
        },
        likesInfo: await this.getLikesInfo(comment.id, userId),
      });
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: await Promise.all(promises),
    };
  }
}
