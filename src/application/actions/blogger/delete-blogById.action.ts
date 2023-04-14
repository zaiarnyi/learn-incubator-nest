import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';

@Injectable()
export class DeleteBlogByIdAction {
  logger = new Logger(DeleteBlogByIdAction.name);

  constructor(
    @Inject(MainBlogsRepository)
    private readonly mainRepository: MainBlogsRepository,
    @Inject(QueryBlogsRepository) private readonly queryRepository: QueryBlogsRepository,
  ) {}

  private async validate(id: string, userId: string) {
    const findBlog = await this.queryRepository.getBlogById(id);

    if (!findBlog) {
      throw new NotFoundException();
    }

    if (findBlog.userId !== userId) {
      throw new ForbiddenException();
    }
  }

  async execute(id: string, userId: string) {
    await this.validate(id, userId);

    await this.mainRepository.deleteBlogById(id).catch(() => {
      this.logger.error(`Error when deleting a blog with ID - ${id}`);
      throw new NotFoundException();
    });
  }
}
