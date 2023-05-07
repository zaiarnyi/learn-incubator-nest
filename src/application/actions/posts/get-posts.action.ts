import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { QueryParamsGetPostsDto } from '../../../domain/posts/dto/query-params-get-posts.dto';
import { plainToClass } from 'class-transformer';
import { GetPost, GetPostsResponse } from '../../../presentation/responses/posts/get-all-posts.response';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';
import { BlogEntity } from '../../../domain/blogs/entities/blog.entity';

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

    const posts = [];
    for (const p of postsRaw) {
      const blog = p.blog as BlogEntity;
      const formattedPost = plainToClass(GetPost, {
        id: p.id.toString(),
        title: p.title,
        shortDescription: p.short_description,
        content: p.content,
        blogId: blog.id.toString(),
        blogName: blog.name,
        createdAt: p.createdAt,
        extendedLikesInfo: await this.likesInfoService.likesInfo(p.id, userId),
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
