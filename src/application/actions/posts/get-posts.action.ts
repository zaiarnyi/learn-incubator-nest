import { Inject, Injectable, Logger } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { QueryParamsGetPostsDto } from '../../../domain/posts/dto/query-params-get-posts.dto';
import { plainToClass } from 'class-transformer';
import { GetPost, GetPostsResponse } from '../../../presentation/responses/posts/get-all-posts.response';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { CreateImageResponse } from '../../../presentation/requests/blogger/create-images.response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetPostsAction {
  private logger = new Logger(GetPostsAction.name);
  constructor(
    private readonly queryRepository: QueryPostRepository,
    private readonly likesInfoService: GetLikesInfoForPostService,
    private readonly queryPostsRepository: QueryPostRepository,
    private readonly configService: ConfigService,
  ) {}

  private async prepareImages(postId: number): Promise<CreateImageResponse> {
    const images = await this.queryPostsRepository.getPostImages(postId);
    return plainToClass(CreateImageResponse, {
      main: images.map((item) => ({ ...item, url: this.configService.get('AWS_LINK') + item.path })),
    });
  }

  public async execute(query: QueryParamsGetPostsDto, user?: UserEntity) {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const skip = (pageNumber - 1) * pageSize;

    const [postsRaw, totalCount] = await this.queryRepository
      .getPost(pageSize, skip, sortBy, sortDirection)
      .catch((e) => {
        this.logger.error(`There was an error in receiving the post data.  ${JSON.stringify(e)}`);
        return [];
      });
    const pagesCount = Math.ceil(totalCount / pageSize);

    const promises = postsRaw.map(async (p) => {
      return plainToClass(GetPost, {
        ...p,
        id: p.id.toString(),
        blogId: p.blog.id.toString(),
        blogName: p.blog.name,
        extendedLikesInfo: await this.likesInfoService.likesInfo(p.id, user?.id),
        images: await this.prepareImages(p.id),
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
