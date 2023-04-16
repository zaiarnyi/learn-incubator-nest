import { InjectModel } from '@nestjs/mongoose';
import {
  LikeStatusComment,
  LikeStatusCommentDocument,
} from '../../../../../domain/comments/like-status/entity/like-status-comments.entity';
import { Model } from 'mongoose';

export class QueryLikeStatusRepository {
  constructor(@InjectModel(LikeStatusComment.name) private readonly model: Model<LikeStatusCommentDocument>) {}

  async getMyStatusByCommentId(id: string, userId): Promise<LikeStatusCommentDocument> {
    return this.model.findOne({ commentId: id, userId, isBanned: false });
  }

  async getCountLikesByCommentId(id: string, status: string): Promise<number> {
    return this.model.find({ commentId: id, [status]: true, isBanned: false }).count();
  }
}
