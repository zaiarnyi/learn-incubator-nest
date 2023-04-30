import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserEntity } from '../../../../domain/users/entities/user.entity';
import { SortDirection } from '../../../../domain/users/enums/sort.enum';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async getAllUsers(
    searchLogin: string,
    searchEmail: string,
    skip: number,
    limit: number,
    sortBy: string,
    direction: string,
    filter: Record<any, any> = {},
  ): Promise<UserEntity[]> {
    console.log('isBanned' in filter);
    if ('isBanned' in filter) {
      return this.dataSource.query(
        `SELECT * FROM users WHERE is_banned = $3 AND "login" LIKE $1 OR "email" LIKE $2
               ORDER BY (case when $5 = 'ASC' then $4 end) ASC,
                        (case when $5 = 'DESC' then $4 end) DESC
               LIMIT $6
               OFFSET $7`,
        [
          `%${searchLogin}%`,
          `%${searchEmail}%`,
          filter.isBanned,
          sortBy.toString(),
          direction.toUpperCase(),
          limit,
          skip,
        ],
      );
    }
    return this.dataSource.query(
      `SELECT * FROM users WHERE "login" LIKE $1 OR "email" LIKE $2
             ORDER BY (case when $3 = 'ASC' then $4 end) ASC,
                      (case when $3 = 'DESC' then $4 end) DESC
             LIMIT $5
             OFFSET $6`,
      [`%${searchLogin}%`, `%${searchEmail}%`, sortBy, direction, limit, skip],
    );
  }

  async getCountUsers(
    searchLoginTerm: string,
    searchEmailTerm: string,
    filter: Record<any, any> = {},
  ): Promise<number> {
    let usersCount = 0;
    if ('isBanned' in filter) {
      const count = await this.dataSource.query(
        `SELECT COUNT(*) FROM users WHERE is_banned = $3 AND "login" LIKE $1 OR "email" LIKE $2`,
        [`%${searchLoginTerm}%`, `%${searchEmailTerm}%`, filter.isBanned],
      );
      usersCount = count[0].count;
    } else {
      const count = await this.dataSource.query(`SELECT COUNT(*) FROM users WHERE "login" LIKE $1 OR "email" LIKE $2`, [
        `%${searchLoginTerm}%`,
        `%${searchEmailTerm}%`,
      ]);
      usersCount = count[0].count;
    }

    return usersCount;
  }

  async getUserByEmailOrLogin(login: string, email: string): Promise<UserEntity> {
    const user = await this.dataSource.query(`SELECT * FROM users WHERE login = $1 OR email = $2 LIMIT 1`, [
      login,
      email,
    ]);
    return user.length ? user[0] : null;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.dataSource.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email]);
    return user.length ? user[0] : null;
  }

  async getUserById(id: number): Promise<UserEntity> {
    if (!id) return null;
    const u = await this.dataSource.query(`SELECT * FROM users WHERE id = $1 LIMIT 1`, [id]);
    return u.length ? u[0] : null;
  }

  async getUserRole(id: string, role: number): Promise<UserDocument> {
    return this.userModel.findOne({ userId: id, role });
  }
}
