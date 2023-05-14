import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { CreateBlogDto } from '../../../domain/blogs/dto/create-blog.dto';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { UserEntity } from '../../../domain/users/entities/user.entity';

@Injectable()
export class UpdateBlogAction {
  logger = new Logger(UpdateBlogAction.name);
  constructor(
    @Inject(MainBlogsRepository)
    private readonly mainRepository: MainBlogsRepository,
    @Inject(QueryBlogsRepository) private readonly queryRepository: QueryBlogsRepository,
  ) {}

  private async validateBlog(id: number, userId: number) {
    const findBlog = await this.queryRepository.getBlogById(id);
    if (!findBlog) {
      throw new NotFoundException();
    }

    if (findBlog.user.id !== userId) {
      throw new ForbiddenException();
    }
  }

  async execute(id: number, dto: CreateBlogDto, user: UserEntity) {
    await this.validateBlog(id, user.id);

    await this.mainRepository.updateBlog(id, user.id, dto).catch((e) => {
      this.logger.error(`Error when updating the blog with ID - ${id}. ${JSON.stringify(e)}`);
      throw new NotFoundException();
    });
  }
}
