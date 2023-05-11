// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { DeleteResult } from 'mongodb';
// import { UserBanned, UserBannedDocument } from '../../../../../../domain/sa/users/entities/user-bans.entity';
//
// @Injectable()
// export class MainUserBannedRepository {
//   constructor(@InjectModel(UserBanned.name) private readonly model: Model<UserBannedDocument>) {}
//
//   async setUserBan(userBanned: UserBanned): Promise<UserBannedDocument> {
//     const hasUserBan = await this.model.findOne({ userId: userBanned.userId });
//     if (hasUserBan) {
//       return this.model.findOneAndUpdate({ userId: userBanned.userId }, userBanned);
//     }
//     return this.model.create(userBanned);
//   }
//
//   async deleteBan(userId: string): Promise<UserBannedDocument> {
//     return this.model.findOneAndRemove({ userId });
//   }
//
//   async save(body: UserBanned): Promise<UserBannedDocument> {
//     const hasUserBan = await this.model.findOne({ userId: body.userId, blogId: body.blogId });
//     if (hasUserBan) {
//       return this.model.findOneAndUpdate({ userId: body.userId, blogId: body.blogId }, body);
//     }
//     return this.model.create(body);
//   }
//
//   async deleteAll(): Promise<DeleteResult> {
//     return this.model.deleteMany();
//   }
// }
