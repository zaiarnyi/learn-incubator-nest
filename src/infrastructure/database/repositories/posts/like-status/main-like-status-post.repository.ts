import { Injectable } from '@nestjs/common';
import { PostLikesEntity } from '../../../../../domain/posts/like-status/entity/like-status-posts.entity';
import { DeleteResult } from 'mongodb';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class MainLikeStatusPostRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async changePostMyStatus(body: PostLikesEntity): Promise<PostLikesEntity> {
    const query = `UPDATE post_likes
           SET "like" = $1, "dislike" = $2, "my_status" = $3
           WHERE "post" = $4 AND "user" = $5 RETURNING *`;
    const find = await this.dataSource.query(query, [body.like, body.dislike, body.my_status, body.post, body.user]);
    return find.length ? find[0] : null;
  }

  async createDefaultStatusForPost(body: PostLikesEntity): Promise<PostLikesEntity> {
    const query = `INSERT INTO post_likes ("like", "dislike", "my_status", "user", "post")
            VALUES ($1, $2, $3, $4, $5)`;
    const insert = await this.dataSource.query(query, [body.like, body.dislike, body.my_status, body.user, body.post]);
    return insert.length ? insert[0] : null;
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.dataSource.query('DELETE FROM post_likes');
  }

  async changeStatusBan(userId: number, isBanned: boolean): Promise<any> {
    await this.dataSource.query(`UPDATE post_likes SET "is_banned" = $1 WHERE "user" = $2`, [isBanned, userId]);
  }
}
