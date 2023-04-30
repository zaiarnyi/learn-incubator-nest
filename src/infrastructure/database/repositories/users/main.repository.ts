import { CreateUserVo } from '../../../../domain/users/vo/create-user.vo';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserEntity } from '../../../../domain/users/entities/user.entity';
import { Model } from 'mongoose';
import { DeleteResult, UpdateResult } from 'mongodb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class UserMainRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async createUser(user: Omit<CreateUserVo, 'password'>): Promise<UserEntity> {
    const createdUser = await this.dataSource.query(
      `INSERT INTO users (login, email, "password_hash", "is_confirm", "is_send_email")
              VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.login, user.email, user.passwordHash, user.isConfirm, user.isSendEmail],
    );
    return createdUser[0];
  }

  async deleteUserById(id: number): Promise<UserDocument> {
    return this.dataSource.query(`DELETE FROM users WHERE id = $1`, [id]);
  }

  async deleteAllUsers(): Promise<DeleteResult> {
    return this.dataSource.query(`DELETE FROM users`);
  }

  async changeStatusSendEmail(userId: number, flag: boolean) {
    return this.dataSource.query(`UPDATE users SET "is_send_email" = $1 WHERE id = $2`, [flag, userId]);
  }

  async changeStatusConfirm(userId: number, status: boolean) {
    return this.dataSource.query(`UPDATE users SET "is_confirm" = $1 WHERE id = $2`, [status, userId]);
  }

  async updatePasswordUser(userId: number, hash: string): Promise<UserEntity> {
    return this.dataSource.query(`UPDATE users SET "password_hash" = $1 WHERE id = $2`, [hash, userId]);
  }

  async changeUserRole(userId: number, role: number) {
    return this.dataSource.query(`UPDATE users SET "role" = $1 WHERE id = $2`, [role, userId]);
  }

  async changeStatusBan(userId: number, isBanned: boolean) {
    return this.dataSource.query(`UPDATE users SET "is_banned" = $1 WHERE id = $2`, [isBanned, userId]);
  }
}
