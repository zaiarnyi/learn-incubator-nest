import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetBlogsWithOwnerResponse } from '../../../../presentation/responses/sa/blogs/get-blogs.response';
import { QueryBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { plainToClass } from 'class-transformer';
import { QueryUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';

@Injectable()
export class GetBlogsActions {
  private logger = new Logger(GetBlogsActions.name);

  constructor(
    @Inject(QueryBlogsRepository) private readonly blogRepository: QueryBlogsRepository,
    @Inject(QueryUserBannedRepository) private userBannedRepository: QueryUserBannedRepository,
  ) {}

  public async execute(query: any): Promise<GetBlogsWithOwnerResponse> {
    const filter = { userId: { $ne: null } };
    const totalCount = await this.blogRepository.getCountBlogs(query.searchNameTerm, '', filter);
    const skip = (query.pageNumber - 1) * query.pageSize;
    const pagesCount = Math.ceil(totalCount / query.pageSize);
    const blogs = await this.blogRepository.getBlogs(
      query.searchNameTerm,
      skip,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
      '',
      filter,
    );

    const promises = blogs.map(async (item) => {
      const banned = await this.userBannedRepository.checkStatusByBlog(item.userId, item._id.toString());
      return Object.assign(item, {
        id: item._id.toString(),
        blogOwnerInfo: { userId: item.userId, userLogin: item.userLogin },
        banInfo: {
          isBanned: banned ?? null,
          banDate: banned?.createdAt ?? null,
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
