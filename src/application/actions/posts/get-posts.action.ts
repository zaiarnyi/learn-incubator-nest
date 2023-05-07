import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { QueryParamsGetPostsDto } from '../../../domain/posts/dto/query-params-get-posts.dto';
import { plainToClass } from 'class-transformer';
import { GetPost, GetPostsResponse } from '../../../presentation/responses/posts/get-all-posts.response';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';
import { PostEntity } from '../../../domain/posts/entities/post.entity';

@Injectable()
export class GetPostsAction {
  private logger = new Logger(GetPostsAction.name);
  constructor(
    @Inject(QueryPostRepository) private readonly queryRepository: QueryPostRepository,
    @Inject(GetLikesInfoForPostService) private readonly likesInfoService: GetLikesInfoForPostService,
  ) {}

  public async execute(query: QueryParamsGetPostsDto, userId?: number) {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const totalCount = await this.queryRepository.getCountPosts();
    const skip = (pageNumber - 1) * pageSize;
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postsRaw = await this.queryRepository.getPost(pageSize, skip, sortBy, sortDirection).catch((e) => {
      this.logger.error(`There was an error in receiving the post data.  ${JSON.stringify(e, null, 2)}`);
      throw new BadRequestException();
    });

    const promises = postsRaw.map(async (p: PostEntity & { name: string; postId: number }) => {
      return plainToClass(GetPost, {
        id: p.postId.toString(),
        title: p.title,
        shortDescription: p.short_description,
        content: p.content,
        blogId: p.blog.toString(),
        blogName: p.name,
        createdAt: p.createdAt,
        extendedLikesInfo: await this.likesInfoService.likesInfo(p.id, userId),
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
