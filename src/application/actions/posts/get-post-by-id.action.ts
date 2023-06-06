import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { GetPost } from '../../../presentation/responses/posts/get-all-posts.response';
import { plainToClass } from 'class-transformer';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';
import { QueryUserBannedRepository } from '../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { CreateImageResponse } from '../../../presentation/requests/blogger/create-images.response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetPostByIdAction {
  logger = new Logger(GetPostByIdAction.name);
  constructor(
    private readonly queryRepository: QueryPostRepository,
    private readonly queryBlogRepository: QueryBlogsRepository,
    private readonly likesInfoService: GetLikesInfoForPostService,
    private readonly queryUserBannedRepository: QueryUserBannedRepository,
    private readonly configService: ConfigService,
  ) {}

  private async prepareImages(postId: number): Promise<CreateImageResponse> {
    const images = await this.queryRepository.getPostImages(postId);
    return plainToClass(CreateImageResponse, {
      main: images.map((item) => ({ ...item, url: this.configService.get('AWS_LINK') + item.path })),
    });
  }

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
    if (!postById || postById.isBanned || postById.blog.isBanned) {
      throw new NotFoundException();
    }

    return plainToClass(GetPost, {
      id: id.toString(),
      title: postById.title,
      shortDescription: postById.shortDescription,
      content: postById.content,
      blogId: postById.blog.id.toString(),
      blogName: postById.blog.name,
      createdAt: postById.createdAt,
      extendedLikesInfo: await this.likesInfoService.likesInfo(id, userId),
      images: await this.prepareImages(id),
    });
  }
}
