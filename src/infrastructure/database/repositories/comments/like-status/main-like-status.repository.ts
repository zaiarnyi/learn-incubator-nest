import { CommentLikesEntity } from '../../../../../domain/comments/like-status/entity/like-status-comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class MainLikeStatusRepository {
  constructor(@InjectRepository(CommentLikesEntity) private readonly repository: Repository<CommentLikesEntity>) {}

  async changeLikeStatusByCommentId(body: CommentLikesEntity): Promise<CommentLikesEntity> {
    return this.repository.save(body);
  }

  async changeStatusForUserBanned(userId: number, isBanned: boolean): Promise<any> {
    return this.repository.update({ user: { id: userId } }, { isBanned });
  }
}
