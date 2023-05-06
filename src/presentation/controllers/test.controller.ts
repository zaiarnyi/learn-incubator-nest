import { BadRequestException, Controller, Delete, HttpCode, Inject, Logger } from '@nestjs/common';
import { UserMainRepository } from '../../infrastructure/database/repositories/users/main.repository';
import { MainPostRepository } from '../../infrastructure/database/repositories/posts/main-post.repository';
import { MainBlogsRepository } from '../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { MainCommentsRepository } from '../../infrastructure/database/repositories/comments/main-comments.repository';
import { MainLikeStatusRepository } from '../../infrastructure/database/repositories/comments/like-status/main-like-status.repository';
import { MainLikeStatusPostRepository } from '../../infrastructure/database/repositories/posts/like-status/main-like-status-post.repository';
import { MainSecurityRepository } from '../../infrastructure/database/repositories/security/main-security.repository';
import { MainUserBannedRepository } from '../../infrastructure/database/repositories/sa/users/main-user-banned.repository';

@Controller('testing')
export class TestController {
  logger = new Logger(TestController.name);
  constructor(
    @Inject(UserMainRepository) private readonly userRepository: UserMainRepository,
    @Inject(MainPostRepository) private readonly postRepository: MainPostRepository,
    @Inject(MainBlogsRepository) private readonly blogRepository: MainBlogsRepository,
    @Inject(MainCommentsRepository) private readonly commentRepository: MainCommentsRepository,
    @Inject(MainLikeStatusRepository) private readonly likeStatusCommentRepository: MainLikeStatusRepository,
    @Inject(MainLikeStatusPostRepository) private readonly likeStatusPostRepository: MainLikeStatusPostRepository,
    @Inject(MainSecurityRepository) private readonly securityRepository: MainSecurityRepository,
    @Inject(MainUserBannedRepository) private readonly bannedRepository: MainUserBannedRepository,
  ) {}
  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    await Promise.all([
      this.userRepository.deleteAllUsers(),
      this.blogRepository.deleteAllBlogs(),
      this.commentRepository.deleteAllComments(),
      this.postRepository.deleteAllPosts(),
      this.likeStatusCommentRepository.deleteAll(),
      this.likeStatusPostRepository.deleteAll(),
      this.securityRepository.deleteAll(),
      this.bannedRepository.deleteAll(),
    ]).catch((e) => {
      this.logger.error(`Error when deleting all test data. ${JSON.stringify(e, null, 2)}`);
      throw new BadRequestException();
    });
  }
}
