import { Injectable } from '@nestjs/common';
import { PostLikesEntity } from '../../../../../domain/posts/like-status/entity/like-status-posts.entity';
import { DeleteResult } from 'mongodb';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MainLikeStatusPostRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(PostLikesEntity) private readonly repository: Repository<PostLikesEntity>,
  ) {}

  async saveStatus(status: PostLikesEntity): Promise<PostLikesEntity> {
    return this.repository.save(status);
  }

  async deleteAll(): Promise<DeleteResult> {
    return this.dataSource.query('DELETE FROM post_likes');
  }

  async changeStatusBan(userId: number, isBanned: boolean): Promise<any> {
    await this.dataSource.query(`UPDATE post_likes SET "is_banned" = $1 WHERE "user" = $2`, [isBanned, userId]);
  }
}
