import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  GetBlogsWithOwner,
  GetBlogsWithOwnerResponse,
} from '../../../../presentation/responses/sa/blogs/get-blogs.response';
import { QueryBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { plainToClass } from 'class-transformer';
import { QueryUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';
import { BlogEntity } from '../../../../domain/blogs/entities/blog.entity';

@Injectable()
export class GetBlogsActions {
  private logger = new Logger(GetBlogsActions.name);

  constructor(
    @Inject(QueryBlogsRepository) private readonly blogRepository: QueryBlogsRepository,
    @Inject(QueryUserBannedRepository) private userBannedRepository: QueryUserBannedRepository,
  ) {}

  public async execute(query: any): Promise<GetBlogsWithOwnerResponse> {
    // const totalCount = await this.blogRepository.getCountBlogs(query.searchNameTerm, null, true);
    const skip = (query.pageNumber - 1) * query.pageSize;
    const [blogs, totalCount] = await this.blogRepository.getBlogs(
      query.searchNameTerm,
      skip,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
      null,
      true,
      null,
      true,
    );

    const pagesCount = Math.ceil(totalCount / query.pageSize);

    const promises = blogs.map((item: BlogEntity) => {
      return plainToClass(GetBlogsWithOwner, {
        ...item,
        id: item.id.toString(),
        blogOwnerInfo: { userId: item.user.id.toString(), userLogin: item.user.login },
        banInfo: {
          isBanned: item?.isBanned ?? false,
          banDate: item?.banDate ?? null,
        },
      });
    });

    return plainToClass(GetBlogsWithOwnerResponse, {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: await Promise.all(promises),
    });
  }
}
