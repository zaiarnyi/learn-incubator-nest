import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { QueryParamsGetPostsDto } from '../../../domain/posts/dto/query-params-get-posts.dto';
import { plainToClass } from 'class-transformer';
import { GetPost, GetPostsResponse } from '../../../presentation/responses/posts/get-all-posts.response';
import { StatusCommentEnum } from '../../../domain/posts/enums/status-comment.enum';

@Injectable()
export class GetPostsAction {
  private logger = new Logger(GetPostsAction.name);
  constructor(@Inject(QueryPostRepository) private readonly queryRepository: QueryPostRepository) {}

  public async execute(query: QueryParamsGetPostsDto) {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const totalCount = await this.queryRepository.getCountPosts();
    const skip = (pageNumber - 1) * pageSize;
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postsRaw = await this.queryRepository.getPost(pageSize, skip, sortBy, sortDirection).catch((e) => {
      this.logger.error(`There was an error in receiving the post data.  ${JSON.stringify(e, null, 2)}`);
      throw new BadRequestException('');
    });

    const posts = postsRaw.map((post) => {
      return plainToClass(GetPost, {
        ...post,
        id: post._id.toString(),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: StatusCommentEnum.None,
          newestLikes: [],
        },
      });
    });

    return plainToClass(GetPostsResponse, {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: posts,
    });
  }
}
