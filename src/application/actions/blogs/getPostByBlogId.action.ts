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

@Injectable()
export class GetPostByBlogIdAction {
  logger = new Logger(GetPostByBlogIdAction.name);
  constructor(@Inject(QueryBlogsRepository) private readonly queryRepository: QueryBlogsRepository) {}
  private async validate(id: string, query: GetPostByBlogIdDto): Promise<void> {
    await validateOrReject(query);

    const blog = await this.queryRepository.getBlogById(id).catch((e) => {
      this.logger.warn(`Error when receiving a blog with id - ${id}. ${JSON.stringify(e, null, 2)}`);
      throw new NotFoundException();
    });
    if (!blog) {
      this.logger.warn(`Not Found Blog: ${id}`);
      throw new NotFoundException();
    }
  }

  public async execute(id: string, query: GetPostByBlogIdDto): Promise<GetPostByBlogIdResponse> {
    await this.validate(id, query);

    const { pageSize, pageNumber, sortBy, sortDirection } = query;
    const totalCount = await this.queryRepository.getPostsCount();
    this.logger.warn('totalCount ' + totalCount);
    const skip = (pageNumber - 1) * pageSize;
    const pagesCount = Math.ceil(totalCount / pageSize);
    this.logger.warn('pagesCount ' + pagesCount);

    const postsRaw = await this.queryRepository.getPostByBlogId(id, skip, pageSize, sortBy, sortDirection);

    const post = postsRaw.map((item) => {
      return plainToClass(PostByBlogItem, {
        ...item,
        id: item._id.toString(),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      });
    });

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: post,
    };
  }
}
