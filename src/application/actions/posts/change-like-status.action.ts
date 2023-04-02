import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChangeLikeStatusPostDto } from '../../../domain/posts/like-status/dto/change-like-status-post.dto';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { validateOrReject } from 'class-validator';
import { MainLikeStatusPostRepository } from '../../../infrastructure/database/repositories/posts/like-status/main-like-status-post.repository';

@Injectable()
export class ChangeLikeStatusPostAction {
  private logger = new Logger(ChangeLikeStatusPostAction.name);

  constructor(
    @Inject(QueryPostRepository) private readonly queryRepository: QueryPostRepository,
    @Inject(MainLikeStatusPostRepository) private readonly statusMainRepository: MainLikeStatusPostRepository,
  ) {}

  private async validate(id: string, body: ChangeLikeStatusPostDto) {
    try {
      await validateOrReject(body);
    } catch (e) {
      throw new BadRequestException(e);
    }

    const checkPost = await this.queryRepository.getPostById(id);
    if (!checkPost) {
      throw new NotFoundException();
    }
  }

  public async execute(id: string, body: ChangeLikeStatusPostDto) {
    await this.validate(id, body);

    await this.statusMainRepository.changePostStatus(id, body.likeStatus).catch((e) => {
      this.logger.error(`Error when updating post status - ${id}. ${JSON.stringify(e)}`);
    });
  }
}
