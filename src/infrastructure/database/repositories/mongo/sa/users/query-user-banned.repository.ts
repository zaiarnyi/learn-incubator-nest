// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { UserBanned, UserBannedDocument } from '../../../../../../domain/sa/users/entities/user-bans.entity';
//
// @Injectable()
// export class QueryUserBannedRepository {
//   constructor(@InjectModel(UserBanned.name) private readonly model: Model<UserBannedDocument>) {}
//
//   async checkStatus(userId: string): Promise<UserBannedDocument> {
//     return this.model.findOne({ userId, blogId: null });
//   }
//
//   async checkStatusByUserBlog(userId: string, blogId: string): Promise<UserBannedDocument> {
//     return this.model.findOne({ userId, blogId });
//   }
//   async checkStatusByBlog(blogId: string): Promise<UserBannedDocument> {
//     return this.model.findOne({ blogId });
//   }
//
//   async getCountByBlog(searchLogin: string, blogId: string): Promise<number> {
//     return this.model.count({ blogId, userLogin: { $regex: new RegExp(searchLogin, 'gi') } });
//   }
//
//   async getUserBannedByBlog(
//     blogId: string,
//     searchLogin: string,
//     skip: number,
//     limit: number,
//     sortBy: string,
//     sortDir: string,
//   ): Promise<UserBannedDocument[]> {
//     if (sortBy === 'login') {
//       sortBy = 'userLogin';
//     }
//     return this.model
//       .find({ blogId, userLogin: { $regex: new RegExp(searchLogin, 'gi') } })
//       .sort({ [sortBy]: sortDir as 'asc' | 'desc' })
//       .skip(skip)
//       .limit(limit);
//   }
// }
