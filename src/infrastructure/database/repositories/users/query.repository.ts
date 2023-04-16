import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../../../domain/users/entities/user.entity';
import { SortDirection } from '../../../../domain/users/enums/sort.enum';

@Injectable()
export class UserQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getAllUsers(
    searchLogin: string,
    searchEmail: string,
    skip: number,
    limit: number,
    sortBy: string,
    direction: string,
    filter: Record<any, any> = {},
  ): Promise<UserDocument[]> {
    return this.userModel
      .find(filter)
      .or([{ login: { $regex: new RegExp(searchLogin, 'gi') } }, { email: { $regex: new RegExp(searchEmail, 'gi') } }])
      .sort({ [sortBy]: direction as SortDirection })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async getCountUsers(searchLoginTerm: string, searchEmailTerm: string, filter: Record<any, any> = {}) {
    return this.userModel.countDocuments({
      filter,
      $or: [
        { login: { $regex: new RegExp(searchLoginTerm, 'gi') } },
        { email: { $regex: new RegExp(searchEmailTerm, 'gi') } },
      ],
    });
  }

  async getUserByEmailOrLogin(login: string, email: string): Promise<UserDocument> {
    return this.userModel
      .findOne({
        $or: [{ email }, { login }],
      })
      .lean();
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async getUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async getUserRole(id: string, role: number): Promise<UserDocument> {
    return this.userModel.findOne({ userId: id, role });
  }
}
