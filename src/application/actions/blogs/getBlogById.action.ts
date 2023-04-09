import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogs/create-blog.response';

@Injectable()
export class GetBlogByIdAction {
  logger = new Logger(GetBlogByIdAction.name);
  constructor(
    @Inject(QueryBlogsRepository)
    private readonly queryRepository: QueryBlogsRepository,
  ) {}
  async execute(id: string): Promise<CreateBlogResponse> {
    const findBlog = await this.queryRepository.getBlogById(id).catch((e) => {
      this.logger.error(`I can't find the blog. ID: ${id}`);
      throw new NotFoundException();
    });
    if (!findBlog) {
      throw new NotFoundException();
    }
    return plainToClass(CreateBlogResponse, {
      ...findBlog.toObject(),
      id,
    });
  }
}
