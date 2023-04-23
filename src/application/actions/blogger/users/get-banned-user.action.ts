import { Inject, Injectable } from '@nestjs/common';
import { GetUserBannedByBlogResponse } from '../../../../presentation/responses/blogger/get-user-banned-by-blog.response';
import { QueryGetBannedUsersDto } from '../../../../domain/blogger/dto/query-get-banned-users.dto';
import { QueryUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GetBannedUserAction {
  constructor(@Inject(QueryUserBannedRepository) private readonly userBannedRepository: QueryUserBannedRepository) {}

  public async execute(blogId: string, query: QueryGetBannedUsersDto): Promise<GetUserBannedByBlogResponse | any> {
    const totalCount = await this.userBannedRepository.getCountByBlog(query.searchLoginTerm, blogId);
    const skip = (query.pageNumber - 1) * query.pageSize;
    const pagesCount = Math.ceil(totalCount / query.pageSize);

    const users = await this.userBannedRepository.getUserBannedByBlog(
      blogId,
      query.searchLoginTerm,
      skip,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
    );

    const items = users.map((item) => ({
      id: item.userId,
      login: item.userLogin,
      banInfo: {
        isBanned: true,
        banDate: item.banDate,
        banReason: item.banReason,
      },
    }));

    return plainToClass(GetUserBannedByBlogResponse, {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });
  }
}
