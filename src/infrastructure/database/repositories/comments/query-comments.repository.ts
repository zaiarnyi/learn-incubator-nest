import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../../../domain/comments/entities/comment.entity';

@Injectable()
export class QueryCommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async getCountComments(): Promise<number> {
    return this.commentModel.find().count();
  }
  async getCommentByPostId(
    postId: string,
    offset: number,
    limit: number,
    sortBy: string,
    direction: string,
  ): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ postId })
      .sort({ [sortBy]: direction as 'asc' | 'desc' })
      .skip(offset)
      .limit(limit)
      .lean();
  }

  async getCommentById(id: string): Promise<CommentDocument> {
    return this.commentModel.findById(id);
  }

  async getCommentByIdForUser(userId: string, id: string): Promise<CommentDocument> {
    return this.commentModel.findOne({ userId, id });
  }
}
