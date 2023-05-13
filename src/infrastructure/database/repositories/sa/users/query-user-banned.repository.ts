import { Injectable } from '@nestjs/common';
import { UserBannedEntity } from '../../../../../domain/sa/users/entities/user-bans.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QueryUserBannedRepository {
  constructor(@InjectRepository(UserBannedEntity) private readonly repository: Repository<UserBannedEntity>) {}

  async checkStatus(userId: number): Promise<UserBannedEntity> {
    return this.repository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
  }

  async checkStatusByUserBlog(userId: number, blogId: number): Promise<UserBannedEntity> {
    return this.repository.findOne({
      where: {
        // blog: { id: blogId },
        user: { id: userId },
      },
      relations: ['user', 'blog'],
    });
  }

  async getCountByBlog(searchLogin: string, blogId: number): Promise<number> {
    // const query = `SELECT COUNT(*) FROM user_bans
    //         LEFT JOIN users ON user_bans."user" = users."id"
    //         WHERE user_bans."blog" = $1 AND users."login" ILIKE $2`;
    //
    // const count = await this.dataSource.query(query, [blogId, `%${searchLogin}%`]);
    // return count.length ? +count[0].count : 0;
    return 0;
  }

  async getUserBannedByBlog(
    blogId: number,
    searchLogin: string,
    skip: number,
    limit: number,
    sortBy: string,
    sortDir: string,
  ): Promise<UserBannedEntity[]> {
    // const directionUpper = sortBy === 'createdAt' ? sortDir : 'COLLATE "C"' + sortDir.toUpperCase();
    // const query = `SELECT ub.*, u."login" FROM user_bans ub
    //     LEFT JOIN users u ON ub."user" = u."id"
    //     WHERE ub."blog" = $1 AND u."login" ILIKE $2
    //     ORDER BY "${sortBy}" ${directionUpper}
    //     LIMIT $3
    // `;
    // return this.dataSource.query(query, [blogId, `%${searchLogin}%`, limit]);
    return [];
  }
}
