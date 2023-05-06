import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogEntity } from '../../../../domain/blogs/entities/blog.entity';
import { Model } from 'mongoose';
import { Post, PostDocument, PostEntity } from '../../../../domain/posts/entities/post.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class QueryBlogsRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async getBlogs(
    filter: string,
    skip: number,
    limit: number,
    sortBy: string,
    direction: string,
    userId?: string,
    userIsNotNull?: boolean,
    isBanned?: boolean,
    isJoinUser?: boolean,
  ): Promise<BlogEntity[]> {
    const directionUpper = sortBy === 'createdAt' ? direction : 'COLLATE "C"' + direction.toUpperCase();
    let query = `SELECT * FROM blogs`;

    if (isJoinUser) {
      query += ` Left JOIN users ON blogs."user" = users.id`;
    }

    query += ' WHERE blogs."deletedAt" is NULL';

    if (userId) {
      query += ` AND blogs."user" = ${userId}`;
    }

    if (typeof isBanned === 'boolean') {
      query += ` AND blogs."is_banned" = ${isBanned}`;
    }

    if (filter) {
      query += ` AND blogs."name" ILIKE '%${filter}%'`;
    }

    if (userIsNotNull) {
      query += ` AND blogs."user" is not null`;
    }

    query += ` ORDER BY "${sortBy}" ${directionUpper}
               LIMIT $1
               OFFSET $2`;

    return this.dataSource.query(query, [limit, skip]);
  }
  async getBlogById(id: number): Promise<BlogEntity> {
    const blog = await this.dataSource.query(
      `SELECT * FROM blogs
             WHERE id = $1 AND "is_banned" = FALSE`,
      [id],
    );
    return blog.length ? blog[0] : null;
  }

  async getPostsCount(blogId: number): Promise<number> {
    const count = await this.dataSource.query(`SELECT COUNT(*) FROM posts WHERE "id" = $1 AND "is_banned" = FALSE`, [
      blogId,
    ]);
    return +count[0].count;
  }

  async getCountBlogs(filter?: string, userId?: string, userIsNotNull?: boolean, isBanned?: boolean): Promise<number> {
    let query = `SELECT COUNT(*) FROM blogs`;
    query += ' WHERE "deletedAt" is NULL';
    if (userId) {
      query += ` AND "user" = ${userId}`;
    }

    if (typeof isBanned === 'boolean') {
      query += ` AND "is_banned" = ${isBanned}`;
    }

    if (filter) {
      query += ` AND "name" ILIKE '%${filter}%'`;
    }

    if (userIsNotNull) {
      query += ` AND "user" is not null`;
    }
    const count = await this.dataSource.query(query);
    return +count[0].count;
  }

  async getPostByBlogId(
    id: number,
    skip: number,
    limit: number,
    sortBy: string,
    direction: string,
  ): Promise<PostEntity[]> {
    const directionUpper = sortBy === 'createdAt' ? direction : 'COLLATE "C"' + direction.toUpperCase();
    const query = `SELECT * FROM posts WHERE "id" = $1 AND "is_banned" = FALSE
                        LEFT JOIN blogs ON posts."blog" = blogs."id"
                        ORDER BY "${sortBy}" ${directionUpper}
                        LIMIT $2
                        OFFSET $3`;

    return this.dataSource.query(query, [id, limit, skip]);
  }

  async getBlogsByBlogger(userId: number): Promise<number[]> {
    return this.dataSource.query(`SELECT id FROM blogs WHERE "user" = $1`, [userId]);
  }

  async getBlogsByBloggerWithUser(blogId: number): Promise<BlogEntity> {
    const query = `SELECT * FROM blogs
          WHERE id = $1 AND "is_banned" = FALSE
          LIMIT 1`;
    const blog = await this.dataSource.query(query, [blogId]);
    return blog.length ? blog[0] : null;
  }
}
