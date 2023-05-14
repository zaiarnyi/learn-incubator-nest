import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  private async validate(id: number, userId: number) {
    const findBlog = await this.queryRepository.getBlogById(id);

    if (!findBlog) {
      throw new NotFoundException();
    }

    if (!userId) {
      throw new UnauthorizedException();
    }

    if (findBlog.user.id !== userId) {
      throw new ForbiddenException();
    }
  }

  async execute(id: number, userId: number) {
    await this.validate(id, userId);

    await this.mainRepository.deleteBlogById(id).catch(() => {
      this.logger.error(`Error when deleting a blog with ID - ${id}`);
      throw new NotFoundException();
    });
  }
}
