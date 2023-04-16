import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { QueryParamsGetPostsDto } from '../../../domain/posts/dto/query-params-get-posts.dto';
import { plainToClass } from 'class-transformer';
import { GetPost, GetPostsResponse } from '../../../presentation/responses/posts/get-all-posts.response';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';
import { QueryUserBannedRepository } from '../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';

@Injectable()
export class GetPostsAction {
  private logger = new Logger(GetPostsAction.name);
  constructor(
    @Inject(QueryPostRepository) private readonly queryRepository: QueryPostRepository,
    @Inject(GetLikesInfoForPostService) private readonly likesInfoService: GetLikesInfoForPostService,
    @Inject(QueryUserBannedRepository) private readonly bannedRepository: QueryUserBannedRepository,
  ) {}

  public async execute(query: QueryParamsGetPostsDto, userId?: string) {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const totalCount = await this.queryRepository.getCountPosts();
    const skip = (pageNumber - 1) * pageSize;
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postsRaw = await this.queryRepository.getPost(pageSize, skip, sortBy, sortDirection).catch((e) => {
      this.logger.error(`There was an error in receiving the post data.  ${JSON.stringify(e, null, 2)}`);
      throw new BadRequestException();
    });

    const posts = [];
    for (const p of postsRaw) {
      const isBannedUser = await this.bannedRepository.checkStatus(p.userId);
      if (isBannedUser) continue;

      const formattedPost = plainToClass(GetPost, {
        ...p,
        id: p._id.toString(),
        extendedLikesInfo: await this.likesInfoService.likesInfo(p._id.toString(), userId),
      });
      posts.push(formattedPost);
    }

    return plainToClass(GetPostsResponse, {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts,
    });
  }
}
