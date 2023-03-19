import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../../../../domain/comments/entities/comment.entity';
import { Model } from 'mongoose';

@Injectable()
export class MainCommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async deleteAllComments() {
    return this.commentModel.deleteMany();
  }
}
