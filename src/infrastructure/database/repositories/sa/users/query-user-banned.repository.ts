import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserBanned, UserBannedDocument } from '../../../../../domain/sa/users/entities/user-bans.entity';
import { Model } from 'mongoose';

@Injectable()
export class QueryUserBannedRepository {
  constructor(@InjectModel(UserBanned.name) private readonly model: Model<UserBannedDocument>) {}

  async checkStatus(userId: string): Promise<UserBannedDocument> {
    return this.model.findOne({ userId });
  }
}
