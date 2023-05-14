import { Inject, Injectable, Logger } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { QueryParamsGetPostsDto } from '../../../domain/posts/dto/query-params-get-posts.dto';
import { plainToClass } from 'class-transformer';
import { GetPost, GetPostsResponse } from '../../../presentation/responses/posts/get-all-posts.response';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';
import { PostEntity } from '../../../domain/posts/entities/post.entity';
import { UserEntity } from '../../../domain/users/entities/user.entity';

@Injectable()
export class GetPostsAction {
  private logger = new Logger(GetPostsAction.name);
  constructor(
    @Inject(QueryPostRepository) private readonly queryRepository: QueryPostRepository,
    @Inject(GetLikesInfoForPostService) private readonly likesInfoService: GetLikesInfoForPostService,
  ) {}

  public async execute(query: QueryParamsGetPostsDto, user: UserEntity) {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const skip = (pageNumber - 1) * pageSize;

    const [postsRaw, totalCount] = await this.queryRepository
      .getPost(pageSize, skip, sortBy, sortDirection)
      .catch((e) => {
        this.logger.error(`There was an error in receiving the post data.  ${JSON.stringify(e)}`);
        return [];
      });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const promises = postsRaw.map(async (p: PostEntity) => {
      return plainToClass(GetPost, {
        ...p,
        id: p.id.toString(),
        blogId: p.blog.id.toString(),
        blogName: p.blog.name,
        extendedLikesInfo: await this.likesInfoService.likesInfo(p.id, user.id),
      });
    });

    return plainToClass(GetPostsResponse, {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: await Promise.all(promises),
    });
  }
}
