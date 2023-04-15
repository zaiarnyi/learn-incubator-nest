import { CreateBlogDto } from '../../../../domain/blogs/dto/create-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../../../../domain/blogs/entities/blog.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MainBlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}
  async createBlog(dto: CreateBlogDto): Promise<BlogDocument> {
    return this.blogModel.create(dto);
  }

  async updateBlog(id: string, userId: string, dto: CreateBlogDto): Promise<BlogDocument> {
    return this.blogModel.findOneAndUpdate({ _id: id, userId }, dto);
  }

  async deleteBlogById(id: string): Promise<BlogDocument> {
    return this.blogModel.findByIdAndDelete(id);
  }

  async deleteAllBlogs() {
    return this.blogModel.deleteMany();
  }

  async bindUserToBlog(id: string, userId: string, userLogin: string) {
    return this.blogModel.findOneAndUpdate({ id }, { userId, userLogin });
  }
}
