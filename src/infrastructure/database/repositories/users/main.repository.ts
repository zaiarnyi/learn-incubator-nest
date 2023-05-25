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
        `TRUNCATE TABLE users, activate_emails_code,pair_results, user_security, users_banned,invalid_tokens, comments, blogs, posts, comment_likes, post_likes,pairs_questions_quiz, quiz, pairs, pair_answers  CASCADE;`,
      ),
      this.dataSource.query(
        `TRUNCATE TABLE users, activate_emails_code,pair_results, user_security, users_banned, invalid_tokens, comments, blogs, posts, comment_likes, post_likes,pairs_questions_quiz, quiz, pairs, pair_answers RESTART IDENTITY;`,
      ),
    ]);
  }
  async deletePairAndUser() {
    await Promise.all([
      this.dataSource.query(
        `TRUNCATE TABLE users, invalid_tokens,users_banned, user_security, pairs_questions_quiz, activate_emails_code, blogs,posts, comments, comment_likes, post_likes, pair_results,pairs, pair_answers CASCADE;`,
      ),
      this.dataSource.query(
        `TRUNCATE TABLE users, invalid_tokens, pair_results, users_banned, user_security, pairs_questions_quiz, activate_emails_code, blogs,posts, comments, comment_likes, post_likes, pairs, pair_answers RESTART IDENTITY;`,
      ),
    ]);
  }
}
