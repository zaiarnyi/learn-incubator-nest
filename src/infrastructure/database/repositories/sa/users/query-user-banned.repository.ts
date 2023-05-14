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
        blog: { id: blogId },
        user: { id: userId },
      },
      relations: ['user', 'blog'],
    });
  }

  async getUserBannedByBlog(
    blogId: number,
    searchLogin: string,
    skip: number,
    limit: number,
    sortBy: string,
    sortDir: string,
  ): Promise<[UserBannedEntity[], number]> {
    return this.repository
      .createQueryBuilder('ub')
      .leftJoinAndSelect('ub.user', 'user')
      .leftJoinAndSelect('ub.blog', 'blog', `blog.id = ${blogId}`)
      .where('user.login ILIKE :login', { login: `%${searchLogin}%` })
      .orderBy(`ub."${sortBy}"`, sortDir.toUpperCase() as 'ASC' | 'DESC')
      .limit(3)
      .getManyAndCount();
  }
}
