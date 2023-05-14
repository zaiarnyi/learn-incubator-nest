import { CreateUserVo } from '../../../../domain/users/vo/create-user.vo';
import { UserEntity } from '../../../../domain/users/entities/user.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

export class UserMainRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async deleteUserById(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }

  async changeStatusSendEmail(userId: number, flag: boolean) {
    return this.userRepository.update({ id: userId }, { isSendEmail: flag });
  }

  async changeStatusConfirm(userId: number, status: boolean) {
    return this.userRepository.update({ id: userId }, { isConfirm: status });
  }

  async updatePasswordUser(userId: number, hash: string) {
    return this.userRepository.update({ id: userId }, { passwordHash: hash });
  }

  async changeStatusBan(userId: number, isBanned: boolean) {
    return this.userRepository.update({ id: userId }, { isBanned });
  }

  async deleteAllData() {
    await Promise.all([
      this.dataSource.query(
        `TRUNCATE TABLE users, activate_emails_code, user_security, users_banned,invalid_tokens, comments, blogs, posts, comment_likes, post_likes  CASCADE;`,
      ),
      this.dataSource.query(
        `TRUNCATE TABLE users, activate_emails_code, user_security, users_banned, invalid_tokens, comments, blogs, posts, comment_likes, post_likes RESTART IDENTITY;`,
      ),
    ]);
  }
}
