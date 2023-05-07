import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangeLikeStatusPostDto } from '../../../domain/posts/like-status/dto/change-like-status-post.dto';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { validateOrReject } from 'class-validator';
import { MainLikeStatusPostRepository } from '../../../infrastructure/database/repositories/posts/like-status/main-like-status-post.repository';
import { QueryLikeStatusPostRepository } from '../../../infrastructure/database/repositories/posts/like-status/query-like-status-post.repository';
import { LikeStatusPosts, PostLikesEntity } from '../../../domain/posts/like-status/entity/like-status-posts.entity';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';

@Injectable()
export class ChangeLikeStatusPostAction {
  private logger = new Logger(ChangeLikeStatusPostAction.name);

  constructor(
    @Inject(QueryPostRepository) private readonly queryRepository: QueryPostRepository,
    @Inject(MainLikeStatusPostRepository) private readonly statusMainRepository: MainLikeStatusPostRepository,
    @Inject(QueryLikeStatusPostRepository) private readonly statusQueryRepository: QueryLikeStatusPostRepository,
    @Inject(UserQueryRepository) private readonly userQueryRepository: UserQueryRepository,
  ) {}

  private async validate(id: number, body: ChangeLikeStatusPostDto) {
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

  public async execute(id: number, body: ChangeLikeStatusPostDto, userId: number) {
    await this.validate(id, body);

    const user = await this.userQueryRepository.getUserById(userId).catch((e) => {
      this.logger.error(`Error when getting a user to create a status for a post with id ${id}. ${JSON.stringify(e)}`);
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const status = new PostLikesEntity();
    status.post = id;
    status.user = user.id;
    status.my_status = body.likeStatus;
    status.like = LikeStatusEnum.Like === body.likeStatus;
    status.dislike = LikeStatusEnum.Dislike === body.likeStatus;

    const findMyStatus = await this.statusQueryRepository.checkUserStatus(id, userId);
    if (findMyStatus) {
      await this.statusMainRepository.changePostMyStatus(id, status).catch((e) => {
        this.logger.error(`Error when updating post status - ${id}. ${JSON.stringify(e)}`);
      });
      return;
    }

    await this.statusMainRepository.createDefaultStatusForPost(status).catch((e) => {
      this.logger.error(`Error when create post status - ${id}. ${JSON.stringify(e)}`);
    });
  }
}
