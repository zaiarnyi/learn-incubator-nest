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
    const totalCount = await this.queryRepository.getCountBlogs(query.searchNameTerm, userId, null, false);
    const skip = (query.pageNumber - 1) * query.pageSize;
    const pagesCount = Math.ceil(totalCount / query.pageSize);
    const blogs = await this.queryRepository.getBlogs(
      query.searchNameTerm,
      skip,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
      userId,
      null,
      false,
    );

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: blogs.map((item) =>
        plainToClass(CreateBlogResponse, {
          id: item.id.toString(),
          name: item.name,
          description: item.description,
          websiteUrl: item.website_url,
          createdAt: item.createdAt,
          isMembership: item.is_membership,
        }),
      ),
    };
  }
}
