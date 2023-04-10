import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidTokens, InvalidTokensDocument } from '../../../infrastructure/database/entity/invalid-tokens.entity';
import { DeleteResult } from 'mongodb';

@Injectable()
export class InvalidUserTokensService {
  private logger = new Logger(InvalidUserTokensService.name);
  constructor(@InjectModel(InvalidTokens.name) private model: Model<InvalidTokensDocument>) {}

  public async checkTokenFromUsers(token: string): Promise<boolean> {
    return !!(await this.model.findOne({ token }));
  }

  public async saveToken(token: string): Promise<InvalidTokensDocument> {
    return this.model.create({ token });
  }

  public async removeToken(token: string): Promise<DeleteResult> {
    return this.model.findOneAndDelete({ token });
  }
}
