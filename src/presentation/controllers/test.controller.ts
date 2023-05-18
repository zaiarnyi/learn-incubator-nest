import { Controller, Delete, Get, HttpCode, Inject, Logger } from '@nestjs/common';
import { UserMainRepository } from '../../infrastructure/database/repositories/users/main.repository';
import * as fs from 'fs';

const readFile = () => {
  return new Promise((resolve) => {
    fs.promises
      .readFile(process.cwd() + '/' + 'rules.txt', { encoding: 'utf-8' })
      .then(resolve)
      .catch(() => resolve(''));
  });
};

@Controller('testing')
export class TestController {
  logger = new Logger(TestController.name);

  constructor(
    @Inject(UserMainRepository) private readonly userRepository: UserMainRepository, // @Inject(MainPostRepository) private readonly postRepository: MainPostRepository, // @Inject(MainBlogsRepository) private readonly blogRepository: MainBlogsRepository, // @Inject(MainCommentsRepository) private readonly commentRepository: MainCommentsRepository, // @Inject(MainLikeStatusRepository) private readonly likeStatusCommentRepository: MainLikeStatusRepository, // @Inject(MainLikeStatusPostRepository) private readonly likeStatusPostRepository: MainLikeStatusPostRepository, // @Inject(MainSecurityRepository) private readonly securityRepository: MainSecurityRepository, // @Inject(MainUserBannedRepository) private readonly bannedRepository: MainUserBannedRepository,
  ) {}

  @Delete('all-data')
  @HttpCode(204)
  async deleteAllData() {
    await this.userRepository.deleteAllData().catch((e) => {
      this.logger.error(`Error when deleting users test data. ${JSON.stringify(e, null, 2)}`);
    });
  }

  @Get('/rules')
  async getAdguardRules() {
    const arr = await readFile();
    if (typeof arr === 'string') {
      return arr
        .split('\n')
        .slice(0, -1)
        .filter((item) => !/^!/.test(item));
    }
  }
}
