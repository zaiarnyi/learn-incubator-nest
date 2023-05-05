import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../../../../domain/comments/entities/comment.entity';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';

@Injectable()
export class MainCommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async deleteAllComments(): Promise<DeleteResult> {
    return this.commentModel.deleteMany();
  }

  async changeCommentById(id: string, body: any): Promise<CommentDocument> {
    return this.commentModel.findByIdAndUpdate(id, body);
  }

  async removeCommentById(id): Promise<DeleteResult> {
    return this.commentModel.findByIdAndRemove(id);
  }

  async removeAllComments(): Promise<DeleteResult> {
    return this.commentModel.deleteMany();
  }

  async createComment(body: Comment): Promise<CommentDocument> {
    return this.commentModel.create(body);
  }

  async changeBannedStatus(userId: string, isBanned: boolean): Promise<any> {
    return this.commentModel.updateMany({ userId }, { isBanned });
  }

  async changeBannedStatusByBlogger(userId: number, blogId: number, isBanned: boolean): Promise<any> {
    return this.commentModel.updateMany({ userId, blogId }, { isBanned });
  }
}
