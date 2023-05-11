import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { addMinutes } from '../../../../../utils/date';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivateEmailsCodeEntity } from '../../../../../domain/auth/entity/activate-code.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MainActivateCodeRepository {
  constructor(
    @InjectRepository(ActivateEmailsCodeEntity) private readonly repository: Repository<ActivateEmailsCodeEntity>,
  ) {}

  async saveRegActivation(code: string, userId: string, type: string) {
    // const find = await this.repository.findOne({ userId: userId, type: type }).lean();
    // const payload = { code, userId, expireAt: addMinutes(new Date(), 60).getTime(), type };
    // if (find) {
    //   return this.repository.findOneAndUpdate({ userId, type }, payload);
    // }
    // return this.repository.create(payload);
  }

  async getUserIdByCode(code: string, type: string): Promise<any> {
    // const findUserId = await this.repository.findOne({ code, type });
    // return findUserId.userId || null;
  }

  async getItemByCode(code: string, type: string): Promise<any> {
    // const findUserId = await this.repository.findOne({ code, type });
    // return findUserId || null;
  }

  async deleteByCode(code: string, type: string): Promise<any> {
    // return this.repository.findOneAndDelete({ code, type });
  }

  async deleteByUserId(userId: string, type): Promise<any> {
    // return this.repository.findOneAndDelete({ userId, type });
  }
}
