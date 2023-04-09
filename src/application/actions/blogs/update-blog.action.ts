import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { CreateBlogDto } from '../../../domain/blogs/dto/create-blog.dto';

@Injectable()
export class UpdateBlogAction {
  logger = new Logger(UpdateBlogAction.name);
  constructor(
    @Inject(MainBlogsRepository)
    private readonly mainRepository: MainBlogsRepository,
  ) {}

  async execute(id: string, dto: CreateBlogDto) {
    await this.mainRepository
      .updateBlog(id, dto)
      .then((res) => {
        if (!res) {
          this.logger.warn(`Error when updating the blog with ID - ${id}`);
          throw new NotFoundException();
        }
      })
      .catch((e) => {
        this.logger.error(`Error when updating the blog with ID - ${id}. ${JSON.stringify(e)}`);
        throw new NotFoundException();
      });
  }
}
