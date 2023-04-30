import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { addMinutes } from '../../../../utils/date';
import {
  ActivateCode,
  ActivateCodeDocument,
  ActivateEmailsCodeEntity,
} from '../../../../domain/auth/entity/activate-code.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User, UserEntity } from '../../../../domain/users/entities/user.entity';

@Injectable()
export class MainActivateCodeRepository {
  constructor(
    @InjectModel(ActivateCode.name) private readonly repository: Model<ActivateCodeDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async saveRegActivation(code: string, userId: number, type: string) {
    const find = await this.dataSource.query(
      `SELECT * FROM activate_emails_code WHERE "user" = $1 AND "type" = $2 LIMIT 1`,
      [userId, type],
    );

    const parameters = [code, addMinutes(new Date(), 60), userId, type];
    if (find && find.length) {
      return this.dataSource.query(
        `UPDATE activate_emails_code SET code = $1, "expireAt" = $2 WHERE "user" = $3 AND "type" = $4`,
        parameters,
      );
    }

    return this.dataSource.query(
      `INSERT INTO public."activate_emails_code" (code, "expireAt",  "user", "type") VALUES ($1, $2, $3, $4)`,
      parameters,
    );
  }

  async getUserIdByCode(code: string, type: string): Promise<number | null> {
    const findUserId = await this.dataSource.query(
      `SELECT "user" FROM activate_emails_code WHERE code = $1 AND type = $2`,
      [code, type],
    );
    return (findUserId.length && findUserId[0].user) ?? null;
  }

  async getItemByCode(code: string, type: string): Promise<ActivateEmailsCodeEntity> {
    const item = await this.dataSource.query(
      `SELECT * FROM activate_emails_code WHERE code = $1 AND "type" = $2 LIMIT 1`,
      [code, type],
    );

    return item.length ? item[0] : null;
  }

  async deleteByCode(code: string, type: string) {
    return this.dataSource.query(`DELETE FROM activate_emails_code WHERE code = $1 AND "type" = $2`, [code, type]);
  }

  async deleteByUserId(userId: number, type) {
    return this.dataSource.query(`DELETE FROM activate_emails_code WHERE "user" = $1 AND "type" = $2`, [userId, type]);
  }
}
