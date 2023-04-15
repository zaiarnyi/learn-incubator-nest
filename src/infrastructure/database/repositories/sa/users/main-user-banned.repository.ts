import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserBanned, UserBannedDocument } from '../../../../../domain/sa/users/entities/user-bans.entity';
import { Model } from 'mongoose';

@Injectable()
export class MainUserBannedRepository {
  constructor(@InjectModel(UserBanned.name) private readonly model: Model<UserBannedDocument>) {}

  async setUserBan(userId: string, banReason: string): Promise<UserBannedDocument> {
    const hasUserBan = await this.model.findOne({ userId });
    if (hasUserBan) {
      return this.model.findOneAndUpdate({ userId }, { banReason });
    }
    return this.model.create({ userId, banReason });
  }

  async deleteBan(userId: string) {
    return this.model.findOneAndRemove({ userId });
  }

  async deleteAll() {
    return this.model.deleteMany();
  }
}
