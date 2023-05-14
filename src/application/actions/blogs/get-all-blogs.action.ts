import { Inject, Injectable } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { GetBlogsDto } from '../../../domain/blogs/dto/get-blogs.dto';
import { GetAllBlogsResponse } from '../../../presentation/responses/blogger/get-all-blogs.response';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogger/create-blog.response';

@Injectable()
export class GetAllBlogsAction {
  constructor(
    @Inject(QueryBlogsRepository)
    private readonly queryRepository: QueryBlogsRepository,
  ) {}

  public async execute(query: GetBlogsDto, userId?: number): Promise<GetAllBlogsResponse> {
    const skip = (query.pageNumber - 1) * query.pageSize;
    const [blogs, totalCount] = await this.queryRepository.getBlogs(
      query.searchNameTerm,
      skip,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
      userId,
      null,
      false,
    );

    const pagesCount = Math.ceil(totalCount / query.pageSize);

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: blogs.map((item) =>
        plainToClass(CreateBlogResponse, {
          ...item,
          id: item.id.toString(),
        }),
      ),
    };
  }
}
