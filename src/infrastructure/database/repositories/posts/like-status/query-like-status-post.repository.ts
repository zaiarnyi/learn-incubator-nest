import { Injectable } from '@nestjs/common';
import { PostLikesEntity } from '../../../../../domain/posts/like-status/entity/like-status-posts.entity';
import { LikeStatusEnum } from '../../../../enums/like-status.enum';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class QueryLikeStatusPostRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(PostLikesEntity) private readonly repository: Repository<PostLikesEntity>,
  ) {}

  async getCountStatuses(postId: number, status: string): Promise<number> {
    return this.repository.count({
      where: {
        post: { id: postId },
        [status.toLowerCase()]: true,
        isBanned: false,
      },
      relations: ['post'],
    });
  }

  async checkUserStatus(postId: number, userId: number): Promise<PostLikesEntity> {
    return this.repository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
      relations: ['post', 'user'],
    });
  }

  async getLastLikesStatus(postId: number): Promise<PostLikesEntity[]> {
    return this.repository.find({
      where: {
        post: { id: postId },
        isBanned: false,
        [LikeStatusEnum.Like.toLowerCase()]: true,
      },
      relations: ['post', 'user'],
      order: {
        createdAt: 'DESC',
      },
      take: 3,
    });
  }
}
