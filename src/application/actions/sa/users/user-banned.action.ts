import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MainUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/main-user-banned.repository';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';
import { UserBannedDto } from '../../../../domain/sa/users/dto/user-banned.dto';
import { MainCommentsRepository } from '../../../../infrastructure/database/repositories/comments/main-comments.repository';
import { MainBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { MainPostRepository } from '../../../../infrastructure/database/repositories/posts/main-post.repository';
import { UserMainRepository } from '../../../../infrastructure/database/repositories/users/main.repository';
import { MainLikeStatusRepository } from '../../../../infrastructure/database/repositories/comments/like-status/main-like-status.repository';
import { MainLikeStatusPostRepository } from '../../../../infrastructure/database/repositories/posts/like-status/main-like-status-post.repository';

@Injectable()
export class UserBannedAction {
  constructor(
    @Inject(MainUserBannedRepository) private readonly repository: MainUserBannedRepository,
    @Inject(UserQueryRepository) private readonly userRepository: UserQueryRepository,
    @Inject(MainBlogsRepository) private readonly blogRepository: MainBlogsRepository,
    @Inject(MainPostRepository) private readonly postRepository: MainPostRepository,
    @Inject(MainCommentsRepository) private readonly commentsRepository: MainCommentsRepository,
    @Inject(UserMainRepository) private readonly userMainRepository: UserMainRepository,
    @Inject(MainLikeStatusRepository) private readonly likeStatusRepository: MainLikeStatusRepository,
    @Inject(MainLikeStatusPostRepository) private readonly likeStatusPostRepository: MainLikeStatusPostRepository,
  ) {}

  private async changeStatus(userId: string, isBanned: boolean) {
    await Promise.all([
      this.blogRepository.changeBannedStatus(userId, isBanned),
      this.commentsRepository.changeBannedStatus(userId, isBanned),
      this.postRepository.changeBannedStatus(userId, isBanned),
      this.userMainRepository.changeStatusBan(userId, isBanned),
      this.likeStatusRepository.changeStatusForUserBanned(userId, isBanned),
      this.likeStatusPostRepository.changeStatusBan(userId, isBanned),
    ]);
  }

  private async validate(userId: string) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException();
    }
  }

  public async execute(userId: string, body: UserBannedDto) {
    await this.validate(userId);
    if (body.isBanned) {
      await this.repository.setUserBan(userId, body.banReason);
    } else {
      await this.repository.deleteBan(userId);
    }
    await this.changeStatus(userId, body.isBanned);
  }
}
