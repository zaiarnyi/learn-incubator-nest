// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { DeleteResult, UpdateResult } from 'mongodb';
// import { User, UserDocument } from '../../../../../domain/users/entities/user.entity';
// import { CreateUserVo } from '../../../../../domain/users/vo/create-user.vo';
//
// export class UserMainRepository {
//   constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
//   async createUser(user: Omit<CreateUserVo, 'password'>): Promise<UserDocument> {
//     return this.userModel.create(user);
//   }
//
//   async deleteUserById(id: string): Promise<UserDocument> {
//     return this.userModel.findByIdAndDelete(id);
//   }
//
//   async deleteAllUsers(): Promise<DeleteResult> {
//     return this.userModel.deleteMany();
//   }
//
//   async changeStatusSendEmail(userId: string, flag: boolean) {
//     return this.userModel.findByIdAndUpdate(userId, { isSendEmail: flag });
//   }
//
//   async changeStatusConfirm(userId: string, status: boolean): Promise<UserDocument> {
//     return this.userModel.findOneAndUpdate({ _id: userId }, { isConfirm: status });
//   }
//
//   async updatePasswordUser(userId: string, hash: string): Promise<UserDocument> {
//     return this.userModel.findOneAndUpdate({ _id: userId }, { passwordHash: hash });
//   }
//
//   async changeUserRole(userId: string, role: number): Promise<UpdateResult> {
//     return this.userModel.findOneAndUpdate({ userId }, { role });
//   }
//
//   async changeStatusBan(userId: string, isBanned: boolean) {
//     return this.userModel.findByIdAndUpdate(userId, { isBanned });
//   }
// }
