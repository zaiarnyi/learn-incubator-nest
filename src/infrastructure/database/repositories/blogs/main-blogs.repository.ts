import { CreateBlogDto } from '../../../../domain/blogs/dto/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument, BlogEntity } from '../../../../domain/blogs/entities/blog.entity';
import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MainBlogsRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}
  async createBlog(dto: BlogEntity): Promise<BlogEntity> {
    return this.dataSource.query(
      `INSERT INTO blogs (name, description, website_url, user)
             VALUES ($1, $2, $3, $4) RETURNING *`,
      [dto.name, dto.description, dto.website_url, dto.user],
    );
  }

  async updateBlog(id: string, userId: string, dto: CreateBlogDto): Promise<BlogDocument> {
    return this.blogModel.findByIdAndUpdate(id, dto);
  }

  async deleteBlogById(id: string): Promise<BlogDocument> {
    return this.blogModel.findByIdAndDelete(id);
  }

  async deleteAllBlogs(): Promise<DeleteResult> {
    return this.blogModel.deleteMany();
  }

  async bindUserToBlog(id: number, userId: number): Promise<any> {
    const query = `UPDATE blogs SET user = $1 WHERE id = $2`;
    return this.dataSource.query(query, [userId, id]);
  }

  async changeBannedStatus(userId: string, isBanned: boolean): Promise<any> {
    return this.blogModel.updateMany({ userId }, { isBanned });
  }

  async changeBannedStatusByBlogger(userId: string, blogId: string, isBanned: boolean): Promise<any> {
    return this.blogModel.updateMany({ userId, _id: blogId }, { isBanned });
  }

  async changeBannedStatusByBlogId(blogId: number, isBanned: boolean): Promise<any> {
    const banDate = isBanned ? new Date().toISOString() : null;
    const query = `UPDATE blogs SET is_banned = $1, ban_date = $2 WHERE id = $3`;
    return this.dataSource.query(query, [isBanned, banDate, blogId]);
  }
}
