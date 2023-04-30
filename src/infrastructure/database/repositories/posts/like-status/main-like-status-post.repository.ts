import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikeStatusPosts,
  LikeStatusPostsDocument,
} from '../../../../../domain/posts/like-status/entity/like-status-posts.entity';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';

@Injectable()
export class MainLikeStatusPostRepository {
  constructor(@InjectModel(LikeStatusPosts.name) private readonly repository: Model<LikeStatusPostsDocument>) {}

  async changePostMyStatus(id: string, body: LikeStatusPosts): Promise<LikeStatusPostsDocument> {
    return this.repository.findOneAndUpdate({ postId: id, userId: body.userId }, body);
  }

  async createDefaultStatusForPost(body: LikeStatusPosts): Promise<LikeStatusPostsDocument> {
    return this.repository.create(body);
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.repository.deleteMany();
  }

  async changeStatusBan(userId: string, isBanned: boolean): Promise<any> {
    return this.repository.updateMany({ userId }, { isBanned });
  }
}
