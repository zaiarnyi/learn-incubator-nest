import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { CreateBlogDto } from '../../../domain/blogs/dto/create-blog.dto';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';

@Injectable()
export class UpdateBlogAction {
  logger = new Logger(UpdateBlogAction.name);
  constructor(
    @Inject(MainBlogsRepository)
    private readonly mainRepository: MainBlogsRepository,
    @Inject(QueryBlogsRepository) private readonly queryRepository: QueryBlogsRepository,
  ) {}

  private async validateBlog(id: string, userId: string) {
    const findBlog = await this.queryRepository.getBlogById(id);
    if (!findBlog) {
      throw new NotFoundException();
    }

    if (findBlog.userId !== userId) {
      throw new ForbiddenException();
    }
  }

  async execute(id: string, dto: CreateBlogDto, userId: string) {
    await this.validateBlog(id, userId);

    await this.mainRepository.updateBlog(id, userId, dto).catch((e) => {
      this.logger.error(`Error when updating the blog with ID - ${id}. ${JSON.stringify(e)}`);
      throw new NotFoundException();
    });
  }
}
