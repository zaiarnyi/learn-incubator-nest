import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLikesEntity,
  LikeStatusComment,
  LikeStatusCommentDocument,
} from '../../../../../domain/comments/like-status/entity/like-status-comments.entity';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class QueryLikeStatusRepository {
  constructor(
    @InjectModel(LikeStatusComment.name) private readonly model: Model<LikeStatusCommentDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async getMyStatusByCommentId(id: number, userId: number): Promise<CommentLikesEntity> {
    const find = await this.dataSource.query(
      `SELECT * FROM comment_likes
            WHERE "comment" = $1 AND "user" = $2 AND "is_banned" = false`,
      [id, userId],
    );

    return find.length ? find[0] : null;
  }

  async getCountLikesByCommentId(id: number, status: string): Promise<number> {
    const count = await this.dataSource.query(
      `SELECT COUNT(*) FROM comment_likes
            WHERE "comment" = $1 AND "${status}" = true and "is_banned" = false`,
      [id],
    );
    return count.length ? +count[0].count : 0;
  }
}
