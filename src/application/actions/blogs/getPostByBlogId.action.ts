import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { GetPostByBlogIdDto } from '../../../domain/blogs/dto/getPostByBlogId.dto';
import {
  GetPostByBlogIdResponse,
  PostByBlogItem,
} from '../../../presentation/responses/blogger/getPostByBlogId.response';
import { plainToClass } from 'class-transformer';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';
import { BlogEntity } from '../../../domain/blogs/entities/blog.entity';

@Injectable()
export class GetPostByBlogIdAction {
  logger = new Logger(GetPostByBlogIdAction.name);
  constructor(
    @Inject(QueryBlogsRepository) private readonly queryRepository: QueryBlogsRepository,
    @Inject(GetLikesInfoForPostService) private readonly likesInfoService: GetLikesInfoForPostService,
  ) {}
  private async validate(id: number): Promise<void> {
    const blog = await this.queryRepository.getBlogById(id).catch((e) => {
      this.logger.warn(`Error when receiving a blog with id - ${id}. ${JSON.stringify(e)}`);
      throw new NotFoundException();
    });
    if (!blog) {
      this.logger.warn(`Not Found Blog: ${id}`);
      throw new NotFoundException();
    }
  }

  public async execute(id: number, query: GetPostByBlogIdDto, userId?: number): Promise<GetPostByBlogIdResponse> {
    await this.validate(id);

    const { pageSize, pageNumber, sortBy, sortDirection } = query;
    const totalCount = await this.queryRepository.getPostsCount(id);
    const skip = (pageNumber - 1) * pageSize;
    const pagesCount = Math.ceil(totalCount / pageSize);

    const postsRaw = await this.queryRepository.getPostByBlogId(id, skip, pageSize, sortBy, sortDirection);
    const posts = [];

    for (const el of postsRaw) {
      const blog = el.blog as BlogEntity;
      const item = plainToClass(PostByBlogItem, {
        id: el.id.toString(),
        title: el.title,
        shortDescription: el.short_description,
        content: el.content,
        blogId: blog.id.toString(),
        blogName: blog.name,
        createdAt: el.createdAt,
        extendedLikesInfo: await this.likesInfoService.likesInfo(el.id, userId),
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
