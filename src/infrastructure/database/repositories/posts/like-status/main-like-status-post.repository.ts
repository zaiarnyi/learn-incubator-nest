import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikeStatusPosts,
  LikeStatusPostsDocument,
} from '../../../../../domain/posts/like-status/entity/like-status-posts.entity';
import { Model } from 'mongoose';

@Injectable()
export class MainLikeStatusPostRepository {
  constructor(@InjectModel(LikeStatusPosts.name) private readonly repository: Model<LikeStatusPostsDocument>) {}

  async changePostMyStatus(id: string, status: string, userId: string) {
    this.repository.findOneAndUpdate({ postId: id, userId }, { myStatus: status });
  }

  async createDefaultStatusForPost(body: LikeStatusPosts): Promise<LikeStatusPostsDocument> {
    return this.repository.create(body);
  }

  async deleteAll() {
    return this.repository.deleteMany();
  }
}
