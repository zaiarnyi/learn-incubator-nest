import { CreateUserVo } from '../../../../domain/users/vo/create-user.vo';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../../../domain/users/entities/user.entity';
import { Model } from 'mongoose';

export class UserMainRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async createUser(user: Omit<CreateUserVo, 'password'>): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  async deleteUserById(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id);
  }

  async deleteAllUsers() {
    return this.userModel.deleteMany();
  }

  async changeStatusSendEmail(userId: string, flag: boolean) {
    return this.userModel.findByIdAndUpdate(userId, { isSendEmail: flag });
  }

  async changeStatusConfirm(userId: string, status: boolean): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate({ _id: userId }, { isConfirm: status });
  }

  async updatePasswordUser(userId: string, hash: string): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate({ _id: userId }, { passwordHash: hash });
  }
}
