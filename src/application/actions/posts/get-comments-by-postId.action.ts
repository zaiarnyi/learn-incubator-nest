import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GetCommentsByPostIdDto } from '../../../domain/posts/dto/get-comments-by-postId.dto';
import { QueryCommentsRepository } from '../../../infrastructure/database/repositories/comments/query-comments.repository';
import {
  GetCommentsByPostIdResponse,
  PostCommentInfo,
} from '../../../presentation/responses/posts/get-comments-by-postId.response';
import { plainToClass } from 'class-transformer';
import { QueryLikeStatusRepository } from '../../../infrastructure/database/repositories/comments/like-status/query-like-status.repository';
import { ExtendedLikesInfo } from '../../../presentation/responses/extendedLikesInfo.response';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { QueryUserBannedRepository } from '../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';

@Injectable()
export class GetCommentsByPostIdAction {
  private logger = new Logger(GetCommentsByPostIdAction.name);
  constructor(
    @Inject(QueryCommentsRepository) private readonly queryRepository: QueryCommentsRepository,
    @Inject(QueryPostRepository) private readonly queryPostsRepository: QueryPostRepository,
    @Inject(QueryUserBannedRepository) private readonly queryUserBannedRepository: QueryUserBannedRepository,
    @Inject(QueryLikeStatusRepository) private readonly likeStatusCommentRepository: QueryLikeStatusRepository,
  ) {}

  private async validate(postId: string, userId?: string) {
    const post = await this.queryPostsRepository.getPostById(postId).catch((e) => {
      this.logger.error(e);
    });

    if (!post) {
      throw new NotFoundException();
    }
    if (!userId) return;
    const isBannedUser = await this.queryUserBannedRepository.checkStatusByUserBlog(userId, post.blogId);
    if (isBannedUser) {
      throw new ForbiddenException();
    }
  }

  private async getLikesInfo(commentId: string, userId?: string): Promise<ExtendedLikesInfo> {
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
    postId: string,
    query: GetCommentsByPostIdDto,
    userId?: string,
  ): Promise<GetCommentsByPostIdResponse> {
    await this.validate(postId, userId);

    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const totalCount = await this.queryRepository.getCountComments(postId);
    const skip = (pageNumber - 1) * pageSize;
    const pagesCount = Math.ceil(totalCount / pageSize);

    const commentsRaw = await this.queryRepository.getCommentByPostId(postId, skip, pageSize, sortBy, sortDirection);
    const comments = [];

    for (const comment of commentsRaw) {
      const c = plainToClass(PostCommentInfo, {
        ...comment.toObject(),
        id: comment._id.toString(),
        commentatorInfo: {
          userId: comment.userId,
          userLogin: comment.userLogin,
        },
        likesInfo: await this.getLikesInfo(comment._id.toString(), userId),
      });
      comments.push(c);
    }

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: comments,
    };
  }
}
