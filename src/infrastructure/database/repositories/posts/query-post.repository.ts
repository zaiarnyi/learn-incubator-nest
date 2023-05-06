import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument, BlogEntity } from '../../../../domain/blogs/entities/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument, PostEntity } from '../../../../domain/posts/entities/post.entity';
import { PostSortDirection } from '../../../../domain/posts/enums/sort.enum';
import { CommentDocument, Comment } from '../../../../domain/comments/entities/comment.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class QueryPostRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async getCountPosts(): Promise<number> {
    const count = await this.dataSource.query(`SELECT COUNT(*) FROM posts WHERE "is_banned" = false`);
    return +count[0].count;
  }
  async getPost(limit: number, offset: number, sortBy: string, direction: string): Promise<PostEntity[]> {
    const directionUpper = sortBy === 'createdAt' ? direction : 'COLLATE "C"' + direction.toUpperCase();
    const query = `SELECT * FROM posts WHERE "is_banned" = false
                          LEFT JOIN blogs ON posts."blog" = blogs."id"
                          ORDER BY "${sortBy}" ${directionUpper}
                          LIMIT ${limit} OFFSET ${offset}`;
    return this.dataSource.query(query);
  }
  async getPostByBlogId(id: number): Promise<PostEntity> {
    const post = await this.dataSource.query(
      `SELECT * FROM posts
             LEFT JOIN users ON posts."user" = users.id
             LEFT JOIN blogs ON posts."blog" = blogs.id
             WHERE users.id = $1 AND posts."is_banned" = FALSE LIMIT 1`,
      [id],
    );
    return post.length ? post[0] : null;
  }

  async getPostById(id: number): Promise<PostEntity> {
    const post = await this.dataSource.query(
      `SELECT * FROM posts
                WHERE id = $1 AND "is_banned" = FALSE
                LIMIT 1`,
      [id],
    );
    return post.length ? post[0] : null;
  }

  async getAllPostById(id: number): Promise<PostEntity> {
    const post = await this.dataSource.query(
      `SELECT * FROM posts
                WHERE "id" = $1 AND "is_banned" = FALSE`,
      [id],
    );
    return post;
  }
}
