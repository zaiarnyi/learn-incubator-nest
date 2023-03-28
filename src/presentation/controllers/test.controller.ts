import { BadRequestException, Controller, Delete, Get, HttpCode, Inject, Logger } from '@nestjs/common';
import { UserMainRepository } from '../../infrastructure/database/repositories/users/main.repository';
import { MainPostRepository } from '../../infrastructure/database/repositories/posts/main-post.repository';
import { MainBlogsRepository } from '../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { MainCommentsRepository } from '../../infrastructure/database/repositories/comments/main-comments.repository';

@Controller('/testing')
export class TestController {
  logger = new Logger(TestController.name);
  constructor(
    @Inject(UserMainRepository) private readonly userRepository: UserMainRepository,
    @Inject(MainPostRepository) private readonly postRepository: MainPostRepository,
    @Inject(MainBlogsRepository) private readonly blogRepository: MainBlogsRepository,
    @Inject(MainCommentsRepository) private readonly commentRepository: MainCommentsRepository,
  ) {}
  @Delete('/all-data')
  @HttpCode(204)
  async deleteAllData() {
    await Promise.all([
      this.blogRepository.deleteAllBlogs(),
      this.commentRepository.deleteAllComments(),
      this.postRepository.deleteAllPosts(),
      this.userRepository.deleteAllUsers(),
    ]).catch((e) => {
      this.logger.error(`Error when deleting all test data. ${JSON.stringify(e, null, 2)}`);
      throw new BadRequestException();
    });
  }

  @Get()
  async get() {}
}
