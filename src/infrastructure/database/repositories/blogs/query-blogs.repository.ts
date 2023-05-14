import { Injectable } from '@nestjs/common';
import { BlogEntity } from '../../../../domain/blogs/entities/blog.entity';
import { PostEntity } from '../../../../domain/posts/entities/post.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class QueryBlogsRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(BlogEntity) private readonly repository: Repository<BlogEntity>,
  ) {}

  async getBlogs(
    filter: string,
    skip: number,
    limit: number,
    sortBy: string,
    direction: string,
    userId?: number,
    userIsNotNull?: boolean,
    isBanned?: boolean,
    isJoinUser?: boolean,
  ): Promise<[BlogEntity[], number]> {
    const query = this.repository.createQueryBuilder('b');

    if (isJoinUser) {
      query.leftJoinAndSelect('b.user', 'u');
    }

    if (userId) {
      query.andWhere('u.id = :id', { id: userId });
    }
    if (typeof isBanned === 'boolean') {
      query.andWhere('b."isBanned" = :banned', { banned: isBanned });
    }

    if (filter) {
      query.andWhere(`b.name ILIKE :filter`, { filter: `%${filter}%` });
    }

    if (userIsNotNull) {
      query.andWhere('b.user is not null');
    }
    return query
      .orderBy(`b."${sortBy}"`, direction.toUpperCase() as 'DESC' | 'ASC')
      .offset(skip)
      .limit(limit)
      .getManyAndCount();
  }
  async getBlogById(id: number): Promise<BlogEntity> {
    return this.repository.findOne({ where: { id }, relations: ['user'] });
  }

  async getPostsCount(blogId: number): Promise<number> {
    const count = await this.dataSource.query(`SELECT COUNT(*) FROM posts WHERE "blog" = $1 AND "is_banned" = FALSE`, [
      blogId,
    ]);
    return +count[0].count;
  }

  async getBlogsByBlogger(userId: number): Promise<number[]> {
    const blogs = await this.repository.find({ where: { user: { id: userId } }, relations: ['user'] });
    return blogs.map((item) => item.id);
  }

  async getBlogsByBloggerWithUser(blogId: number): Promise<BlogEntity> {
    return this.repository.findOne({ where: { id: blogId, isBanned: false } });
  }
}
