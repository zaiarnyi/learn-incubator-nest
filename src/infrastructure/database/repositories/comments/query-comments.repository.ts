import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument, CommentsEntity } from '../../../../domain/comments/entities/comment.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PostLikesEntity } from '../../../../domain/posts/like-status/entity/like-status-posts.entity';
import { CommentLikesEntity } from '../../../../domain/comments/like-status/entity/like-status-comments.entity';

@Injectable()
export class QueryCommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async getCountComments(postId: number): Promise<number> {
    const comments = await this.dataSource.query(
      `SELECT COUNT(*) FROM comments
            WHERE "post" = $1 AND "is_banned" = FALSE`,
      [postId],
    );
    return +comments[0].count;
  }
  async getCommentByPostId(
    postId: number,
    offset: number,
    limit: number,
    sortBy: string,
    direction: string,
  ): Promise<CommentsEntity[]> {
    const directionUpper = sortBy === 'createdAt' ? direction : 'COLLATE "C"' + direction.toUpperCase();
    const query = `SELECT *, comments.id as "commentId" FROM comments
               LEFT JOIN users u ON comments."user" = u.id
               WHERE "post" = $3 AND "is_banned" = FALSE
               ORDER BY blogs."${sortBy}" ${directionUpper}
               LIMIT $1
               OFFSET $2`;

    return this.dataSource.query(query, [limit, offset, postId]);
  }

  async getCommentById(id: number): Promise<CommentsEntity> {
    const comments = await this.dataSource.query(
      `SELECT *, comments.id as "commentId" FROM comments
    LEFT JOIN users u ON comments."user" = users.id
    WHERE comments."commentId" = $1`,
      [id],
    );
    return comments.length ? comments[0] : null;
  }

  async getCommentByIdForUser(userId: string, id: string): Promise<CommentDocument> {
    return this.commentModel.findOne({ userId, id });
  }

  async getCommentForAllBlogs(
    blogIds: number[],
    skip: number,
    limit: number,
    sortBy: string,
    sortDir: string,
  ): Promise<CommentsEntity[]> {
    const directionUpper = sortBy === 'createdAt' ? sortDir : 'COLLATE "C"' + sortDir.toUpperCase();
    const query = `SELECT *, u."login", comments.id as "commentId", p.*, b.* FROM comments
            LEFT JOIN user u ON comments."user" = users.id
            LEFT JOIN post p ON comments."post" = posts.id
            LEFT JOIN blogs b ON comments."blog" = blogs.id
            WHERE comments."blog" IN (${blogIds.join(',')}) AND comments."is_banned" = false
            ORDER BY blogs."${sortBy}" ${directionUpper}
            LIMIT $1
            OFFSET $2`;
    return this.dataSource.query(query, [limit, skip]);
  }

  async getCountCommentsForAllBlogs(blogIds: number[]): Promise<number> {
    const query = `SELECT COUNT(*) FROM comments
        WHERE "blog" IN (${blogIds.join(',')}) AND "is_banned" = false`;
    const count = await this.dataSource.query(query);
    return +count[0].count;
  }
}
