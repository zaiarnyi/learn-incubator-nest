import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { GetPostByBlogIdDto } from '../../../domain/blogs/dto/getPostByBlogId.dto';
import {
  GetPostByBlogIdResponse,
  PostByBlogItem,
} from '../../../presentation/responses/blogger/getPostByBlogId.response';
import { plainToClass } from 'class-transformer';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';
import { PostEntity } from '../../../domain/posts/entities/post.entity';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';

@Injectable()
export class GetPostByBlogIdAction {
  logger = new Logger(GetPostByBlogIdAction.name);
  constructor(
    @Inject(QueryBlogsRepository) private readonly queryRepository: QueryBlogsRepository,
    @Inject(QueryPostRepository) private readonly queryPostsRepository: QueryPostRepository,
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

  public async execute(id: number, query: GetPostByBlogIdDto, user?: UserEntity): Promise<GetPostByBlogIdResponse> {
    await this.validate(id);

    const { pageSize, pageNumber, sortBy, sortDirection } = query;
    const skip = (pageNumber - 1) * pageSize;

    const [postsRaw, totalCount] = await this.queryPostsRepository.getManyPostsByBlogId(
      id,
      skip,
      pageSize,
      sortBy,
      sortDirection,
    );
    const pagesCount = Math.ceil(totalCount / pageSize);
    const promises = postsRaw.map(async (el: PostEntity) => {
      return plainToClass(PostByBlogItem, {
        ...el,
        id: el.id.toString(),
        blogId: el.blog.id.toString(),
        blogName: el.blog.name,
        extendedLikesInfo: await this.likesInfoService.likesInfo(el.id, user?.id),
      });
    });

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: await Promise.all(promises),
    };
  }
}
