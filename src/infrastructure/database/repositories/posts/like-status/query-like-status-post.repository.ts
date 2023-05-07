import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  LikeStatusPosts,
  LikeStatusPostsDocument,
  PostLikesEntity,
} from '../../../../../domain/posts/like-status/entity/like-status-posts.entity';
import { Model } from 'mongoose';
import { LikeStatusEnum } from '../../../../enums/like-status.enum';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class QueryLikeStatusPostRepository {
  constructor(
    @InjectModel(LikeStatusPosts.name) private readonly repository: Model<LikeStatusPostsDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async getCountStatuses(postId: number, status: string): Promise<number> {
    const count = await this.dataSource.query(
      `SELECT COUNT(*) FROM post_likes
        WHERE "post" = $1 AND "${status.toLowerCase()}" = true AND "is_banned" = FALSE`,
      [postId],
    );

    return count.length ? +count[0].count : 0;
  }

  async checkUserStatus(postId: number, userId: number): Promise<PostLikesEntity> {
    const find = await this.dataSource.query(
      `SELECT * FROM post_likes
    WHERE "post" = $1 AND "user" = $2 AND "is_banned" = FALSE`,
      [postId, userId],
    );
    return find.length ? find[0] : null;
  }

  async getLastLikesStatus(postId: number): Promise<PostLikesEntity[]> {
    const query = `SELECT post_likes.*, u."login" FROM post_likes
            LEFT JOIN users u ON post_likes."user" = u.id
            WHERE post_likes."post" = $1 AND post_likes."is_banned" = FALSE AND post_likes."${LikeStatusEnum.Like.toLowerCase()}" = TRUE
            ORDER BY post_likes."createdAt" DESC
            LIMIT 3`;
    return this.dataSource.query(query, [postId]);
  }
}
