import { InjectModel } from '@nestjs/mongoose';
import {
  CommentLikesEntity,
  LikeStatusComment,
  LikeStatusCommentDocument,
} from '../../../../../domain/comments/like-status/entity/like-status-comments.entity';
import { DeleteResult, UpdateResult } from 'mongodb';
import { Model } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class MainLikeStatusRepository {
  constructor(
    @InjectModel(LikeStatusComment.name) private readonly model: Model<LikeStatusCommentDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async changeLikeStatusByCommentId(body: CommentLikesEntity): Promise<CommentLikesEntity> {
    const findQuery = `SELECT * FROM comment_likes WHERE "comment" = $1 AND "user" = $2`;
    const find = await this.dataSource.query(findQuery, [body.comment, body.user]);
    if (find.length) {
      const updateQuery = `UPDATE comment_likes SET "like" = $1, "dislike" = $2, my_status = $3 WHERE "user" = $4 AND "comment" = $5 RETURNING *`;
      const updated = await this.dataSource.query(updateQuery, [
        body.like,
        body.dislike,
        body.my_status,
        body.user,
        body.comment,
      ]);
      return updated.length ? updated[0] : null;
    }
    const insertQuery = `INSERT INTO ("like", "dislike", "my_status", "user", "comment")
        VALUES ($1, $2, $3, $4, $5)`;
    const insert = await this.dataSource.query(insertQuery, [
      body.like,
      body.dislike,
      body.my_status,
      body.user,
      body.comment,
    ]);

    return insert.length ? insert[0] : null;
  }

  async createLikeStatusForComment(body: LikeStatusComment): Promise<LikeStatusCommentDocument> {
    return this.model.create(body);
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.model.deleteMany();
  }

  async changeStatusForUserBanned(userId: string, isBanned: boolean): Promise<any> {
    return this.model.updateMany({ userId }, { isBanned });
  }
}
