import { Inject, Injectable } from '@nestjs/common';
import { QueryLikeStatusPostRepository } from '../../../infrastructure/database/repositories/posts/like-status/query-like-status-post.repository';
import { LikesInfo, NewestLikes } from '../../../presentation/responses/posts/get-all-posts.response';
import { plainToClass } from 'class-transformer';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { PostLikesEntity } from '../../../domain/posts/like-status/entity/like-status-posts.entity';

@Injectable()
export class GetLikesInfoForPostService {
  constructor(
    @Inject(QueryLikeStatusPostRepository) private readonly statusPostRepository: QueryLikeStatusPostRepository,
  ) {}

  public async likesInfo(postId: number, userId?: number): Promise<LikesInfo | any> {
    const [likesCount, dislikesCount, lastLikes, info] = await Promise.all([
      this.statusPostRepository.getCountStatuses(postId, LikeStatusEnum.Like),
      this.statusPostRepository.getCountStatuses(postId, LikeStatusEnum.Dislike),
      this.statusPostRepository.getLastLikesStatus(postId),
      userId && this.statusPostRepository.checkUserStatus(postId, userId),
    ]);
    const newestLikes = lastLikes?.map((item: PostLikesEntity & { login: string }) => {
      return plainToClass(NewestLikes, {
        addedAt: item.createdAt,
        userId: item.user,
        login: item.login,
      });
    });

    return plainToClass(LikesInfo, {
      likesCount,
      dislikesCount,
      myStatus: info?.my_status ?? LikeStatusEnum.None,
      newestLikes,
    });
  }
}
