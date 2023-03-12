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
}
