import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetBlogsWithOwnerResponse } from '../../../../presentation/responses/sa/blogs/get-blogs.response';
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
    const totalCount = await this.blogRepository.getCountBlogs(query.searchNameTerm, null, true);
    const skip = (query.pageNumber - 1) * query.pageSize;
    const pagesCount = Math.ceil(totalCount / query.pageSize);
    const blogs = await this.blogRepository.getBlogs(
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

    const promises = blogs.map((item: BlogEntity & { login: string; blogId: string }) => {
      return Object.assign(item, {
        id: item.blogId.toString(),
        websiteUrl: item.website_url,
        createdAt: item.createdAt,
        description: item.description,
        isMembership: item.is_membership,
        blogOwnerInfo: { userId: item.user.toString(), userLogin: item.login },
        banInfo: {
          isBanned: item?.is_banned ?? false,
          banDate: item?.ban_date || null,
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
