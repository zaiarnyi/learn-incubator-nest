import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../../domain/users/entities/user.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
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
  ): Promise<[UserEntity[], number]> {
    const query = this.userRepository.createQueryBuilder('u').where(
      new Brackets((qb) => {
        qb.where('u."login" ILIKE :login', { login: `%${searchLogin}%` }).orWhere('u."email" ILIKE :email', {
          email: `%${searchEmail}%`,
        });
      }),
    );

    if ('isBanned' in filter) {
      query.andWhere('u."isBanned" = :banned', { banned: filter.isBanned });
    }

    query
      .orderBy(`u."${sortBy}"`, direction.toUpperCase() as 'ASC' | 'DESC')
      .offset(skip)
      .limit(limit);
    return query.getManyAndCount();
  }

  async getUserByEmailOrLogin(login: string, email: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('u')
      .where('u."login" = :login', { login })
      .orWhere('u."email" = :email', { email })
      .getOne();
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.createQueryBuilder('u').where('u."email" = :email', { email }).getOne();
  }

  async getUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }
}
