import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikeStatusPosts,
  LikeStatusPostsDocument,
} from '../../../../../domain/posts/like-status/entity/like-status-posts.entity';
import { Model } from 'mongoose';
import { LikeStatusEnum } from '../../../../enums/like-status.enum';

@Injectable()
export class QueryLikeStatusPostRepository {
  constructor(@InjectModel(LikeStatusPosts.name) private readonly repository: Model<LikeStatusPostsDocument>) {}

  async getCountStatuses(postId: string, status: string): Promise<number> {
    return this.repository.find({ postId, [status.toLowerCase()]: true }).count();
  }

  async checkUserStatus(postId: string, userId: string) {
    return this.repository.findOne({ postId, userId });
  }

  async getLastLikesStatus(postId: string): Promise<LikeStatusPostsDocument[]> {
    return this.repository
      .find({ postId, [LikeStatusEnum.Like.toUpperCase()]: true })
      .sort({ createdAt: 'desc' })
      .limit(3);
  }
}
