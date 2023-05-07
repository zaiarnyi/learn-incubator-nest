import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentsEntity } from '../../../../domain/comments/entities/comment.entity';
import { Model } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MainCommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async deleteAllComments() {
    return this.dataSource.query('DELETE FROM comments');
  }

  async changeCommentById(id: number, body: any) {
    await this.dataSource.query('UPDATE comments SET "content" = $2 WHERE id = $1', [id, body.content]);
  }

  async removeCommentById(id: number): Promise<DeleteResult> {
    return this.dataSource.query('DELETE FROM comments WHERE id = $1', [id]);
  }

  async removeAllComments(): Promise<DeleteResult> {
    return this.dataSource.query('DELETE FROM comments');
  }

  async createComment(body: CommentsEntity): Promise<CommentsEntity> {
    const query = `INSERT INTO comments ("content", "user", "post", "blog")
        VALUES ($1, $2, $3, $4) RETURNING *`;
    const c = await this.dataSource.query(query, [body.content, body.user, body.post, body.blog]);
    return c.length ? c[0] : null;
  }

  async changeBannedStatus(userId: number, isBanned: boolean): Promise<any> {
    const updated = await this.dataSource.query(
      `UPDATE comments SET "is_banned" = $2
                WHERE "user" = $1 RETURNING *`,
      [userId, isBanned],
    );
    return updated.length ? updated[0] : null;
  }

  async changeBannedStatusByBlogger(userId: number, blogId: number, isBanned: boolean): Promise<any> {
    const updated = await this.dataSource.query(
      `UPDATE comments SET "is_banned" = $2
                WHERE "user" = $1 AND "blog" = $3 RETURNING *`,
      [userId, isBanned, blogId],
    );
    return updated.length ? updated[0] : null;
  }
}
