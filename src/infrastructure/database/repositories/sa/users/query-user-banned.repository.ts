import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserBanned, UserBannedDocument } from '../../../../../domain/sa/users/entities/user-bans.entity';
import { Model } from 'mongoose';

@Injectable()
export class QueryUserBannedRepository {
  constructor(@InjectModel(UserBanned.name) private readonly model: Model<UserBannedDocument>) {}

  async checkStatus(userId: string): Promise<UserBannedDocument> {
    return this.model.findOne({ userId, blogId: null });
  }

  async checkStatusByBlog(userId: string, blogId: string): Promise<UserBannedDocument> {
    return this.model.findOne({ userId, blogId });
  }

  async getCountByBlog(searchLogin: string, blogId: string): Promise<number> {
    return this.model.count({ blogId, userLogin: { $regex: new RegExp(searchLogin, 'gi') } });
  }

  async getUserBannedByBlog(
    blogId: string,
    searchLogin: string,
    skip: number,
    limit: number,
    sortBy: string,
    sortDir: string,
  ): Promise<UserBannedDocument[]> {
    return this.model
      .find({ blogId, userLogin: { $regex: new RegExp(searchLogin, 'gi') } })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortDir as 'asc' | 'desc' });
  }
}
