import { InjectModel } from '@nestjs/mongoose';
import {
  LikeStatusComment,
  LikeStatusCommentDocument,
} from '../../../../../domain/comments/like-status/entity/like-status-comments.entity';
import { UpdateResult } from 'mongodb';
import { Model } from 'mongoose';

export class MainLikeStatusRepository {
  constructor(@InjectModel(LikeStatusComment.name) private readonly model: Model<LikeStatusCommentDocument>) {}

  async changeLikeStatusByCommentId(body: LikeStatusComment): Promise<UpdateResult | LikeStatusCommentDocument> {
    const item = await this.model.findOne({ commentId: body.commentId, userId: body.userId });
    if (item) {
      return this.model.findOneAndUpdate({ commentId: body.commentId }, body);
    }
    return this.model.create(body);
  }

  async createLikeStatusForComment(body: LikeStatusComment): Promise<LikeStatusCommentDocument> {
    return this.model.create(body);
  }

  async deleteAll() {
    return this.model.deleteMany();
  }

  async changeStatusForUserBanned(userId: string, isBanned: boolean) {
    return this.model.updateMany({ userId }, { isBanned });
  }
}
