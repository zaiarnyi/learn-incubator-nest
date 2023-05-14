import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChangeLikeStatusPostDto } from '../../../domain/posts/like-status/dto/change-like-status-post.dto';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { validateOrReject } from 'class-validator';
import { MainLikeStatusPostRepository } from '../../../infrastructure/database/repositories/posts/like-status/main-like-status-post.repository';
import { PostLikesEntity } from '../../../domain/posts/like-status/entity/like-status-posts.entity';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { PostEntity } from '../../../domain/posts/entities/post.entity';

@Injectable()
export class ChangeLikeStatusPostAction {
  private logger = new Logger(ChangeLikeStatusPostAction.name);

  constructor(
    @Inject(QueryPostRepository) private readonly queryRepository: QueryPostRepository,
    @Inject(MainLikeStatusPostRepository) private readonly statusMainRepository: MainLikeStatusPostRepository,
  ) {}

  private async validate(id: number, body: ChangeLikeStatusPostDto): Promise<PostEntity> {
    try {
      await validateOrReject(body);
    } catch (e) {
      throw new BadRequestException(e);
    }

    const checkPost = await this.queryRepository.getPostById(id);
    if (!checkPost) {
      throw new NotFoundException();
    }
    return checkPost;
  }

  public async execute(id: number, body: ChangeLikeStatusPostDto, user: UserEntity) {
    const post = await this.validate(id, body);

    const status = new PostLikesEntity();
    status.post = post;
    status.user = user;
    status.myStatus = body.likeStatus;
    status.like = LikeStatusEnum.Like === body.likeStatus;
    status.dislike = LikeStatusEnum.Dislike === body.likeStatus;

    return this.statusMainRepository.saveStatus(status);
  }
}
