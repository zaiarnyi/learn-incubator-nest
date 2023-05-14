import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetUserBannedByBlogResponse } from '../../../../presentation/responses/blogger/get-user-banned-by-blog.response';
import { QueryGetBannedUsersDto } from '../../../../domain/blogger/dto/query-get-banned-users.dto';
import { QueryUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';
import { plainToClass } from 'class-transformer';
import { QueryBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { UserEntity } from '../../../../domain/users/entities/user.entity';
import { UserBannedEntity } from '../../../../domain/sa/users/entities/user-bans.entity';

@Injectable()
export class GetBannedUserAction {
  constructor(
    @Inject(QueryUserBannedRepository) private readonly userBannedRepository: QueryUserBannedRepository,
    @Inject(QueryBlogsRepository) private readonly blogRepository: QueryBlogsRepository,
  ) {}

  private async validateBlogId(blogId: number, bloggerId: number) {
    const blog = await this.blogRepository.getBlogById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }

    if (blog.user.id !== bloggerId) {
      throw new ForbiddenException();
    }
  }

  public async execute(
    blogId: number,
    query: QueryGetBannedUsersDto,
    bloggerId: number,
  ): Promise<GetUserBannedByBlogResponse | any> {
    await this.validateBlogId(blogId, bloggerId);
    const skip = (query.pageNumber - 1) * query.pageSize;

    const [users, totalCount] = await this.userBannedRepository.getUserBannedByBlog(
      blogId,
      query.searchLoginTerm,
      skip,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
    );

    const pagesCount = Math.ceil(totalCount / query.pageSize);

    const items = users.map((item) => {
      return {
        id: item.user.id.toString(),
        login: item.user.login,
        banInfo: {
          isBanned: true,
          banDate: item.createdAt,
          banReason: item.banReason,
        },
      };
    });

    return plainToClass(GetUserBannedByBlogResponse, {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    });
  }
}
