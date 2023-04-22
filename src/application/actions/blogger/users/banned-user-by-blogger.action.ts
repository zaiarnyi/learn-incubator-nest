import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserBannedByBloggerDto } from '../../../../domain/blogger/dto/user-banned-by-blogger.dto';
import { UserBanned } from '../../../../domain/sa/users/entities/user-bans.entity';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';
import { QueryBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { MainUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/main-user-banned.repository';
import { MainBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { MainPostRepository } from '../../../../infrastructure/database/repositories/posts/main-post.repository';
import { MainCommentsRepository } from '../../../../infrastructure/database/repositories/comments/main-comments.repository';
import { UserDocument } from '../../../../domain/users/entities/user.entity';

@Injectable()
export class BannedUserByBloggerAction {
  private logger = new Logger(BannedUserByBloggerAction.name);
  constructor(
    @Inject(MainUserBannedRepository) private readonly banRepository: MainUserBannedRepository,
    @Inject(UserQueryRepository) private readonly userRepository: UserQueryRepository,
    @Inject(QueryBlogsRepository) private readonly blogRepository: QueryBlogsRepository,
    @Inject(MainBlogsRepository) private readonly blogMainRepository: MainBlogsRepository,
    @Inject(MainPostRepository) private readonly postMainRepository: MainPostRepository,
    @Inject(MainCommentsRepository) private readonly commentMainRepository: MainCommentsRepository,
  ) {}

  private async changeStatus(userId: string, blogId: string, isBanned: boolean) {
    await Promise.all([
      this.blogMainRepository.changeBannedStatusByBlogger(userId, blogId, isBanned),
      this.postMainRepository.changeBannedStatusByBlogger(userId, blogId, isBanned),
      this.commentMainRepository.changeBannedStatusByBlogger(userId, blogId, isBanned),
    ]);
  }

  private async validateAndGetUser(blogId: string, userId: string): Promise<UserDocument> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      this.logger.warn(`Not found user(${userId}) for banned`);
    }

    const blog = await this.blogRepository.getBlogById(blogId);
    if (!blog) {
      this.logger.warn(`Not found blog(${blogId}) for banned`);
    }

    return user;
  }

  public async execute(userId: string, body: UserBannedByBloggerDto) {
    const user = await this.validateAndGetUser(body.blogId, userId);
    await this.changeStatus(userId, body.blogId, body.isBanned);

    if (!body.isBanned) {
      return this.banRepository.deleteBan(userId);
    }

    const bannedUserByBlog = new UserBanned();
    bannedUserByBlog.userId = userId;
    bannedUserByBlog.banReason = body.banReason;
    bannedUserByBlog.blogId = body.blogId;
    bannedUserByBlog.userLogin = user.login;

    return this.banRepository.save(bannedUserByBlog);
  }
}
