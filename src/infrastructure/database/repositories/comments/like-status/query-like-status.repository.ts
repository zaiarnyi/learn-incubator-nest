import { CommentLikesEntity } from '../../../../../domain/comments/like-status/entity/like-status-comments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class QueryLikeStatusRepository {
  constructor(@InjectRepository(CommentLikesEntity) private readonly repository: Repository<CommentLikesEntity>) {}

  async getMyStatusByCommentId(id: number, userId: number): Promise<CommentLikesEntity> {
    return this.repository.findOne({
      where: {
        comment: { id },
        user: { id: userId },
      },
      relations: ['user', 'comment'],
    });
  }

  async getCountLikesByCommentId(id: number, status: string): Promise<number> {
    return this.repository.count({
      where: {
        comment: { id },
        [status]: true,
        isBanned: false,
      },
      relations: ['comment'],
    });
  }
}
