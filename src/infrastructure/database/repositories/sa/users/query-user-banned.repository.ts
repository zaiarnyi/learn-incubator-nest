import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserBanned,
  UserBannedDocument,
  UserBannedEntity,
} from '../../../../../domain/sa/users/entities/user-bans.entity';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class QueryUserBannedRepository {
  constructor(
    @InjectModel(UserBanned.name) private readonly model: Model<UserBannedDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async checkStatus(userId: number): Promise<UserBannedEntity> {
    const d = await this.dataSource.query(`SELECT * FROM user_bans WHERE "user" = $1`, [userId]);
    return d.length ? d[0] : null;
  }

  async checkStatusByUserBlog(userId: string, blogId: string): Promise<UserBannedDocument> {
    return this.model.findOne({ userId, blogId });
  }
  async checkStatusByBlog(blogId: string): Promise<UserBannedDocument> {
    return this.model.findOne({ blogId });
  }

  async getCountByBlog(searchLogin: string, blogId: number): Promise<number> {
    const query = `SELECT COUNT(*) FROM user_bans
            LEFT JOIN users ON user_bans."user" = users."id"
            WHERE user_bans."blog" = $1 AND users."login" ILIKE $2`;

    const count = await this.dataSource.query(query, [blogId, `%${searchLogin}%`]);
    return count.length ? +count[0].count : 0;
  }

  async getUserBannedByBlog(
    blogId: number,
    searchLogin: string,
    skip: number,
    limit: number,
    sortBy: string,
    sortDir: string,
  ): Promise<UserBannedEntity[]> {
    if (sortBy === 'login') {
      sortBy = 'userLogin';
    }
    const directionUpper = sortBy === 'createdAt' ? sortDir : 'COLLATE "C"' + sortDir.toUpperCase();
    const query = `SELECT ub.*, u."login" FROM user_bans ub
        LEFT JOIN users u ON ub."user" = u."id"
        WHERE ub."blog" = $1 AND u."login" ILIKE $2
        ORDER BY "${sortBy}" ${directionUpper}
        LIMIT $3
    `;
    return this.dataSource.query(query, [blogId, `%${searchLogin}%`, limit]);
  }
}
