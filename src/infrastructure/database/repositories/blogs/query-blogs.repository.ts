import { Injectable } from '@nestjs/common';
import { BlogEntity } from '../../../../domain/blogs/entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BlogImagesEntity } from '../../../../domain/blogs/entities/blog-images.entity';
import { BlogImagesTypeEnum } from '../../../../domain/blogs/enums/blog-images-type.enum';
import { SubscriptionUsersBlogsEntity } from '../../../../domain/blogs/entities/subscription-users-blogs.entity';
import { SubscriptionStatusEnum } from '../../../../domain/blogs/enums/subscription-status.enum';

@Injectable()
export class QueryBlogsRepository {
  constructor(
    @InjectRepository(BlogEntity) private readonly repository: Repository<BlogEntity>,
    @InjectRepository(BlogImagesEntity) private readonly blogImagesEntityRepository: Repository<BlogImagesEntity>,
    @InjectRepository(SubscriptionUsersBlogsEntity)
    private readonly subscriptionRepository: Repository<SubscriptionUsersBlogsEntity>,
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
    return this.blogImagesEntityRepository.find({ where: { blog: { id }, type }, relations: ['blog'] });
  }

  async getActiveSubscription(blogId: number, userId: number): Promise<SubscriptionUsersBlogsEntity> {
    return this.subscriptionRepository.findOne({
      where: { user: { id: userId }, blog: { id: blogId }, status: Not(SubscriptionStatusEnum.SUBSCRIPTION) },
      relations: ['user', 'blog'],
    });
  }

  async getActiveSubscriptionsByUser(userId: number): Promise<SubscriptionUsersBlogsEntity[]> {
    return this.subscriptionRepository.find({
      where: { user: { id: userId }, status: Not(SubscriptionStatusEnum.SUBSCRIPTION) },
      relations: ['user', 'blog'],
    });
  }

  async getCountSubscriptionForBlog(blogId: number): Promise<number> {
    return this.subscriptionRepository.count({ where: { blog: { id: blogId } }, relations: ['blog'] });
  }

  async statusSubscriptionForUser(userId: number): Promise<SubscriptionUsersBlogsEntity> {
    return this.subscriptionRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
  }
}
