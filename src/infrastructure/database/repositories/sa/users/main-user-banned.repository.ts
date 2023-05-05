import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserBanned,
  UserBannedDocument,
  UserBannedEntity,
} from '../../../../../domain/sa/users/entities/user-bans.entity';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MainUserBannedRepository {
  constructor(
    @InjectModel(UserBanned.name) private readonly model: Model<UserBannedDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async setUserBan(userBanned: UserBannedEntity) {
    const hasUserBan = await this.dataSource.query(`SELECT * FROM user_bans WHERE "user" = $1`, [userBanned.user]);

    if (hasUserBan && hasUserBan.length) {
      await this.dataSource.query(`UPDATE user_bans SET "ban_reason" = $1 WHERE "user" = $2`, [
        userBanned.ban_reason,
        userBanned.user,
      ]);
      return;
    }

    await this.dataSource.query(`INSERT INTO user_bans ("ban_reason", "user") VALUES ($1, $2)`, [
      userBanned.ban_reason,
      userBanned.user,
    ]);
  }

  async deleteBan(userId: number) {
    return this.dataSource.query(`DELETE FROM user_bans WHERE "user" = $1`, [userId]);
  }

  async save(body: UserBannedEntity): Promise<UserBannedEntity> {
    const findQuery = `SELECT * FROM user_bans WHERE "user" = $1`;
    const hasUserBan = await this.dataSource.query(findQuery, [body.user]);
    if (hasUserBan) {
      const updateQuery = `UPDATE user_bans SET "ban_reason" = $1, "blog" = $2 WHERE "user" = $3 RETURNING *`;
      return this.dataSource.query(updateQuery, [body.ban_reason, body.blog, body.user]);
    }
    const insertQuery = `INSERT INTO user_bans ("ban_reason", "user", "blog") VALUES ($1, $2, $3) RETURNING *`;
    return this.dataSource.query(insertQuery, [body.ban_reason, body.user, body.blog]);
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.dataSource.query(`DELETE FROM user_bans`);
  }
}
