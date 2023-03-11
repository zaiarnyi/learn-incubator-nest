import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
} from '../../../../domain/users/entities/user.entity';

@Injectable()
export class QueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  getAllUsers(
    searchLogin: string,
    searchEmail: string,
    skip: number,
    limit: number,
  ) {
    return this.userModel
      .find()
      .or([
        { login: { $regex: new RegExp(searchLogin, 'gi') } },
        { email: { $regex: new RegExp(searchEmail, 'gi') } },
      ])
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async getCountUsers(searchLoginTerm: string, searchEmailTerm: string) {
    return this.userModel
      .countDocuments()
      .or([
        { login: { $regex: new RegExp(searchLoginTerm, 'gi') } },
        { email: { $regex: new RegExp(searchEmailTerm, 'gi') } },
      ]);
  }
}
