import { Inject, Injectable } from '@nestjs/common';
import { MainBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { MainUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/main-user-banned.repository';
import { UserBanned } from '../../../../domain/sa/users/entities/user-bans.entity';

@Injectable()
export class UpdateStatusBannedByBlogAction {
  constructor(
    @Inject(MainBlogsRepository) private readonly blogMainRepository: MainBlogsRepository,
    @Inject(MainUserBannedRepository) private readonly userBannedRepository: MainUserBannedRepository,
  ) {}

  public async execute(blogId: string, isBanned: boolean) {
    const userBanned = new UserBanned();
    userBanned.blogId = blogId;
    await Promise.all([
      this.userBannedRepository.save(userBanned),
      this.blogMainRepository.changeBannedStatusByBlogId(blogId, isBanned),
    ]);
  }
}
