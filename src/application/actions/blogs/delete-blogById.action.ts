import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';

@Injectable()
export class DeleteBlogByIdAction {
  logger = new Logger(DeleteBlogByIdAction.name);

  constructor(
    @Inject(MainBlogsRepository)
    private readonly mainRepository: MainBlogsRepository,
  ) {}

  async execute(id: string) {
    await this.mainRepository
      .deleteBlogById(id)
      .then((res) => {
        if (!res) {
          this.logger.warn(`Error when deleting a blog with ID - ${id}`);
          throw new NotFoundException();
        }
      })
      .catch((e) => {
        this.logger.error(`Error when deleting a blog with ID - ${id}`);
        throw new NotFoundException();
      });
  }
}
