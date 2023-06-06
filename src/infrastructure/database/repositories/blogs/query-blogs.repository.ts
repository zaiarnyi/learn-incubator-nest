import { Injectable } from '@nestjs/common';
import { BlogEntity } from '../../../../domain/blogs/entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogImagesEntity } from '../../../../domain/blogs/entities/blog-images.entity';
import { BlogImagesTypeEnum } from '../../../../domain/blogs/enums/blog-images-type.enum';

@Injectable()
export class QueryBlogsRepository {
  constructor(
    @InjectRepository(BlogEntity) private readonly repository: Repository<BlogEntity>,
    @InjectRepository(BlogImagesEntity) private readonly blogImagesEntityRepository: Repository<BlogImagesEntity>,
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

    if (isJoinUser || userId) {
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

    if (sortBy === 'login') {
      query.orderBy(`u.login`, direction.toUpperCase() as 'DESC' | 'ASC');
    } else {
      query.orderBy(`b."${sortBy}"`, direction.toUpperCase() as 'DESC' | 'ASC');
    }
    return query.offset(skip).limit(limit).getManyAndCount();
  }
  async getBlogById(id: number): Promise<BlogEntity> {
    return this.repository.findOne({ where: { id }, relations: ['user'] });
  }

  async getBlogsByBlogger(userId: number): Promise<number[]> {
    const blogs = await this.repository.find({ where: { user: { id: userId } }, relations: ['user'] });
    return blogs.map((item) => item.id);
  }

  async getBlogsByBloggerWithUser(blogId: number): Promise<BlogEntity> {
    return this.repository.findOne({ where: { id: blogId, isBanned: false }, relations: ['user'] });
  }

  async getBlogImages(id: number, type: BlogImagesTypeEnum): Promise<BlogImagesEntity[]> {
    return this.blogImagesEntityRepository.find({ where: { id, type } });
  }
}
