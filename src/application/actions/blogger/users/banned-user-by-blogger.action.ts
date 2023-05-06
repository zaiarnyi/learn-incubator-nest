import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserBannedByBloggerDto } from '../../../../domain/blogger/dto/user-banned-by-blogger.dto';
import { UserBanned, UserBannedEntity } from '../../../../domain/sa/users/entities/user-bans.entity';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';
import { QueryBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { MainUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/main-user-banned.repository';
import { MainBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { MainPostRepository } from '../../../../infrastructure/database/repositories/posts/main-post.repository';
import { MainCommentsRepository } from '../../../../infrastructure/database/repositories/comments/main-comments.repository';
import { UserDocument, UserEntity } from '../../../../domain/users/entities/user.entity';
import { BlogEntity } from '../../../../domain/blogs/entities/blog.entity';

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

  private async changeStatus(userId: number, blogId: number, isBanned: boolean) {
    await Promise.all([
      this.blogMainRepository.changeBannedStatusByBlogger(userId, blogId, isBanned),
      this.postMainRepository.changeBannedStatusByBlogger(userId, blogId, isBanned),
      // this.commentMainRepository.changeBannedStatusByBlogger(userId, blogId, isBanned),
    ]);
  }

  private async validateAndGetUser(
    blogId: number,
    userId: number,
    bloggerId: number,
  ): Promise<{ user: UserEntity; blog: BlogEntity }> {
    const user = await this.userRepository.getUserById(userId as number);
    if (!user) {
      this.logger.warn(`Not found user(${userId}) for banned`);
      throw new NotFoundException();
    }

    const blog = await this.blogRepository.getBlogById(blogId);
    if (!blog) {
      this.logger.warn(`Not found blog(${blogId}) for banned`);
      throw new NotFoundException();
    }

    if (blog.user !== bloggerId) {
      throw new ForbiddenException();
    }

    return { user, blog };
  }

  public async execute(userId: number, body: UserBannedByBloggerDto, bloggerId: number) {
    const { user, blog } = await this.validateAndGetUser(body.blogId, userId, bloggerId);
    await this.changeStatus(userId, body.blogId, body.isBanned);

    if (!body.isBanned) {
      return this.banRepository.deleteBan(userId);
    }
    const bannedUserByBlog = new UserBannedEntity();
    bannedUserByBlog.user = user.id;
    bannedUserByBlog.ban_reason = body.banReason;
    bannedUserByBlog.blog = blog.id;

    return this.banRepository.save(bannedUserByBlog).catch((e) => {
      this.logger.error(`Error when save blog banner. MEssage: ${JSON.stringify(e)}`);
    });
  }
}
