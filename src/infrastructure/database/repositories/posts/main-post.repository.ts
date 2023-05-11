import { Injectable } from '@nestjs/common';
import { PostEntity } from '../../../../domain/posts/entities/post.entity';
import { CreatePostDto } from '../../../../domain/posts/dto/create-post.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MainPostRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async createPost(post: PostEntity): Promise<PostEntity> {
    const query = `INSERT INTO posts ("title", "content", "user", "blog", "short_description")
              VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    const postCreated = await this.dataSource.query(query, [
      post.title,
      post.content,
      post.user,
      post.blog,
      post.short_description,
    ]);
    return postCreated[0];
  }
  async updatePost(id: number, payload: CreatePostDto): Promise<PostEntity> {
    const query = `UPDATE posts SET "title" = $1, "content" = $2, "short_description" = $3
                WHERE id = $4 AND "blog" = $5 RETURNING *`;
    return this.dataSource.query(query, [payload.title, payload.content, payload.shortDescription, id, payload.blogId]);
  }

  async deletePost(id: number): Promise<PostEntity> {
    return this.dataSource.query(`DELETE FROM posts WHERE id = $1`, [id]);
  }

  async deleteAllPosts() {
    return this.dataSource.query(`DELETE FROM posts`);
  }
  async changeBannedStatus(userId: number, isBanned: boolean): Promise<any> {
    return this.dataSource.query(`UPDATE posts SET "is_banned" = $1 WHERE "user" = $2`, [isBanned, userId]);
  }

  async changeBannedStatusByBlogger(userId: number, blogId: number, isBanned: boolean): Promise<any> {
    return this.dataSource.query(`UPDATE posts SET "is_banned" = $1 WHERE "user" = $2 AND "blog" = $3`, [
      isBanned,
      userId,
      blogId,
    ]);
  }
}
