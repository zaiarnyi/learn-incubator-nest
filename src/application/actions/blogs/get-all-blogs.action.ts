import { Inject, Injectable, Logger } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { GetBlogsDto } from '../../../domain/blogs/dto/get-blogs.dto';
import { GetAllBlogsResponse } from '../../../presentation/responses/blogs/get-all-blogs.response';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogs/create-blog.response';

@Injectable()
export class GetAllBlogsAction {
  logger = new Logger(GetAllBlogsAction.name);
  constructor(
    @Inject(QueryBlogsRepository)
    private readonly queryRepository: QueryBlogsRepository,
  ) {}

  public async execute(query: GetBlogsDto): Promise<GetAllBlogsResponse> {
    const totalCount = await this.queryRepository.getCountBlogs(query.searchNameTerm);
    const skip = (query.pageNumber - 1) * query.pageSize;
    const pagesCount = Math.ceil(totalCount / query.pageSize);
    const blogs = await this.queryRepository.getBlogs(
      query.searchNameTerm,
      skip,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
    );

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: blogs.length,
      items: blogs.map((item) => plainToClass(CreateBlogResponse, item)),
    };
  }
}
