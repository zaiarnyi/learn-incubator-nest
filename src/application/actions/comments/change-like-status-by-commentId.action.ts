import { BadRequestException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { ChangeLikeStatusDto } from '../../../domain/comments/like-status/dto/change-like-status.dto';
import { validateOrReject } from 'class-validator';
import { QueryCommentsRepository } from '../../../infrastructure/database/repositories/comments/query-comments.repository';
import { MainLikeStatusRepository } from '../../../infrastructure/database/repositories/comments/like-status/main-like-status.repository';
import { CommentLikesEntity } from '../../../domain/comments/like-status/entity/like-status-comments.entity';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';

export class ChangeLikeStatusByCommentIdAction {
  private logger = new Logger(ChangeLikeStatusByCommentIdAction.name);

  constructor(
    @Inject(QueryCommentsRepository) private readonly queryRepository: QueryCommentsRepository,
    @Inject(MainLikeStatusRepository) private readonly likeStatusRepository: MainLikeStatusRepository,
  ) {}
  private async validate(id: number, body: ChangeLikeStatusDto) {
    try {
      await validateOrReject(body);
    } catch (e) {
      throw new BadRequestException(e);
    }
    const checkComment = await this.queryRepository.getCommentById(id);
    if (!checkComment) {
      throw new NotFoundException();
    }
  }
  public async execute(id: number, userId: number, body: ChangeLikeStatusDto): Promise<void> {
    await this.validate(id, body);

    const status = new CommentLikesEntity();
    status.comment = id;
    status.my_status = body.likeStatus;
    status.dislike = body.likeStatus === LikeStatusEnum.Dislike;
    status.like = body.likeStatus === LikeStatusEnum.Like;
    status.user = userId;

    await this.likeStatusRepository.changeLikeStatusByCommentId(status);
  }
}
