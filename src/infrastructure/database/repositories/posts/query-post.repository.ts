import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from '../../../../domain/blogs/entities/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class QueryPostRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getPostByBlogId(id: string): Promise<BlogDocument> {
    return this.blogModel.findById(id);
  }
}
