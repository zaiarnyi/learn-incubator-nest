import { Inject, Injectable } from '@nestjs/common';
import { QueryLikeStatusPostRepository } from '../../../infrastructure/database/repositories/posts/like-status/query-like-status-post.repository';
import { LikesInfo, NewestLikes } from '../../../presentation/responses/posts/get-all-posts.response';
import { plainToClass } from 'class-transformer';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';

@Injectable()
export class GetLikesInfoForPostService {
  constructor(
    @Inject(QueryLikeStatusPostRepository) private readonly statusPostRepository: QueryLikeStatusPostRepository,
  ) {}

  public async likesInfo(postId: string | number, userId?: string): Promise<LikesInfo | any> {
    return plainToClass(LikesInfo, {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatusEnum.None,
      newestLikes: [],
    });

    const [likesCount, dislikesCount, lastLikes, info] = await Promise.all([
      this.statusPostRepository.getCountStatuses(postId as string, LikeStatusEnum.Like),
      this.statusPostRepository.getCountStatuses(postId as string, LikeStatusEnum.Dislike),
      this.statusPostRepository.getLastLikesStatus(postId as string),
      userId && this.statusPostRepository.checkUserStatus(postId as string, userId),
    ]);
    const newestLikes = lastLikes?.map((item) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const addedAt = item.createdAt;
      return plainToClass(NewestLikes, {
        addedAt,
        userId: item.userId,
        login: item.login,
      });
    });

    return plainToClass(LikesInfo, {
      likesCount,
      dislikesCount,
      myStatus: info?.myStatus ?? LikeStatusEnum.None,
      newestLikes,
    });
  }
}
