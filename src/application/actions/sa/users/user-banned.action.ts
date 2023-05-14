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
import { UserEntity } from '../../../../domain/users/entities/user.entity';
import { UserBannedEntity } from '../../../../domain/sa/users/entities/user-bans.entity';

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

  private async changeStatus(userId: number, isBanned: boolean) {
    await Promise.all([
      this.blogRepository.changeBannedStatus(userId, isBanned),
      this.commentsRepository.changeBannedStatus(userId, isBanned),
      this.postRepository.changeBannedStatus(userId, isBanned),
      this.userMainRepository.changeStatusBan(userId, isBanned),
      this.likeStatusRepository.changeStatusForUserBanned(userId, isBanned),
      this.likeStatusPostRepository.changeStatusBan(userId, isBanned),
    ]);
  }

  private async validateAndGetUser(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  public async execute(userId: number, body: UserBannedDto) {
    const user = await this.validateAndGetUser(userId);
    if (body.isBanned) {
      const userBanned = new UserBannedEntity();
      userBanned.user = user;
      userBanned.banReason = body.banReason;
      await this.repository.setUserBan(userBanned);
    } else {
      await this.repository.deleteBan(user);
    }
    await this.changeStatus(userId, body.isBanned);
  }
}
