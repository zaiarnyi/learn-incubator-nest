import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetBlogsWithOwnerResponse } from '../../../../presentation/responses/sa/blogs/get-blogs.response';
import { QueryBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GetBlogsActions {
  private logger = new Logger(GetBlogsActions.name);

  constructor(@Inject(QueryBlogsRepository) private readonly blogRepository: QueryBlogsRepository) {}

  public async execute(query: any): Promise<GetBlogsWithOwnerResponse | any> {
    const totalCount = await this.blogRepository.getCountBlogs(query.searchNameTerm);
    const skip = (query.pageNumber - 1) * query.pageSize;
    const pagesCount = Math.ceil(totalCount / query.pageSize);
    const blogs = await this.blogRepository.getBlogs(
      query.searchNameTerm,
      skip,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
    );

    return plainToClass(GetBlogsWithOwnerResponse, {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: blogs.map((item) => {
        return Object.assign(item, {
          id: item._id.toString(),
          blogOwnerInfo: { userId: item.userId, userLogin: item.userLogin },
        });
      }),
    });
  }
}
