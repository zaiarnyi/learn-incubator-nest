import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { GetPost } from '../../../presentation/responses/posts/get-all-posts.response';
import { plainToClass } from 'class-transformer';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';
import { QueryUserBannedRepository } from '../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';

@Injectable()
export class GetPostByIdAction {
  logger = new Logger(GetPostByIdAction.name);
  constructor(
    @Inject(QueryPostRepository) private readonly queryRepository: QueryPostRepository,
    @Inject(QueryBlogsRepository) private readonly queryBlogRepository: QueryBlogsRepository,
    @Inject(GetLikesInfoForPostService) private readonly likesInfoService: GetLikesInfoForPostService,
    @Inject(QueryUserBannedRepository) private readonly queryUserBannedRepository: QueryUserBannedRepository,
  ) {}

  private async validateIsUserBanned(userId: number) {
    if (!userId) return;
    const hasBanned = await this.queryUserBannedRepository.checkStatus(userId);
    if (hasBanned) {
      throw new NotFoundException();
    }
  }

  public async execute(id: number, userId?: number): Promise<GetPost> {
    await this.validateIsUserBanned(userId);
    const postById = await this.queryRepository.getPostById(id, ['blog']);
    if (!postById) {
      throw new NotFoundException();
    }

    const blog = await this.queryBlogRepository.getBlogById(postById.blog.id);
    if (!blog) {
      throw new NotFoundException();
    }
    return plainToClass(GetPost, {
      id: id.toString(),
      title: postById.title,
      shortDescription: postById.shortDescription,
      content: postById.content,
      blogId: blog.id.toString(),
      blogName: blog.name,
      createdAt: postById.createdAt,
      extendedLikesInfo: await this.likesInfoService.likesInfo(id, userId),
    });
  }
}
