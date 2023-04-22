import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../../../domain/comments/entities/comment.entity';

@Injectable()
export class QueryCommentsRepository {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async getCountComments(postId: string): Promise<number> {
    return this.commentModel.find({ postId }).count({ isBanned: false });
  }
  async getCommentByPostId(
    postId: string,
    offset: number,
    limit: number,
    sortBy: string,
    direction: string,
  ): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ postId, isBanned: false })
      .sort({ [sortBy]: direction as 'asc' | 'desc' })
      .skip(offset)
      .limit(limit);
  }

  async getCommentById(id: string): Promise<CommentDocument> {
    return this.commentModel.findOne({ id });
  }

  async getCommentByIdForUser(userId: string, id: string): Promise<CommentDocument> {
    return this.commentModel.findOne({ userId, id });
  }

  async getCommentForAllBlogs(
    userId: string,
    blogIds: string[],
    skip: number,
    limit: number,
    sortBy: string,
    sortDir: string,
  ) {
    return this.commentModel
      .find({ userId, blogId: { $in: blogIds }, isBanned: false })
      .sort({ [sortBy]: sortDir as 'asc' | 'desc' })
      .skip(skip)
      .limit(limit);
  }

  async getCountCommentsForAllBlogs(userId: string, blogIds: string[]) {
    return this.commentModel.count({ userId, blogId: { $in: blogIds }, isBanned: false });
  }
}
