import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { GetPost } from '../../../presentation/responses/posts/get-all-posts.response';
import { plainToClass } from 'class-transformer';
import { GetLikesInfoForPostService } from '../../services/posts/get-likes-info-for-post.service';

@Injectable()
export class GetPostByIdAction {
  logger = new Logger(GetPostByIdAction.name);
  constructor(
    @Inject(QueryPostRepository) private readonly queryRepository: QueryPostRepository,
    @Inject(GetLikesInfoForPostService) private readonly likesInfoService: GetLikesInfoForPostService,
  ) {}

  public async execute(id: string, userId?: string): Promise<GetPost> {
    const postById = await this.queryRepository
      .getPostById(id)
      .then((result) => {
        if (!result) {
          this.logger.log(`The post with id - ${id} was not found`);
          throw new NotFoundException('Not Found');
        }
        return result;
      })
      .catch((e) => {
        this.logger.error(`Error in getting the post by id: ${id}. ${JSON.stringify(e, null, 2)}`);
        throw new NotFoundException('Not Found');
      });

    return plainToClass(GetPost, {
      ...postById.toObject(),
      id,
      extendedLikesInfo: await this.likesInfoService.likesInfo(id, userId),
    });
  }
}
