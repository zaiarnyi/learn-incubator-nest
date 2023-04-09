import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { GetPostByBlogIdDto } from '../../../domain/blogs/dto/getPostByBlogId.dto';
import {
  GetPostByBlogIdResponse,
  PostByBlogItem,
} from '../../../presentation/responses/blogs/getPostByBlogId.response';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogs/create-blog.response';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';

@Injectable()
export class GetPostByBlogIdAction {
  logger = new Logger(GetPostByBlogIdAction.name);
  constructor(
    @Inject(QueryBlogsRepository) private readonly queryRepository: QueryBlogsRepository,
    @Inject(GetLikesInfoForPostService) private readonly likesInfoService: GetLikesInfoForPostService,
  ) {}
  private async validate(id: string): Promise<void> {
    const blog = await this.queryRepository.getBlogById(id).catch((e) => {
      this.logger.warn(`Error when receiving a blog with id - ${id}. ${JSON.stringify(e, null, 2)}`);
      throw new NotFoundException();
    });
    if (!blog) {
      this.logger.warn(`Not Found Blog: ${id}`);
      throw new NotFoundException();
    }
  }

  public async execute(id: string, query: GetPostByBlogIdDto, userId?: string): Promise<GetPostByBlogIdResponse> {
    await this.validate(id);

    const { pageSize, pageNumber, sortBy, sortDirection } = query;
    const totalCount = await this.queryRepository.getPostsCount(id);
    const skip = (pageNumber - 1) * pageSize;
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postsRaw = await this.queryRepository.getPostByBlogId(id, skip, pageSize, sortBy, sortDirection);
    const posts = [];
    for (const el of postsRaw) {
      const item = plainToClass(PostByBlogItem, {
        ...el,
        id: el._id.toString(),
        extendedLikesInfo: await this.likesInfoService.likesInfo(el._id.toString(), userId),
      });
      posts.push(item);
    }

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: posts,
    };
  }
}
