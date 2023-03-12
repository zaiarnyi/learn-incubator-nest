import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../../../domain/blogs/entities/blog.entity';
import { Model } from 'mongoose';
import { BlogSortDirection } from '../../../../domain/blogs/enums/blog-sort.enum';

@Injectable()
export class QueryBlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getBlogs(filter: string, skip: number, limit: number, sortBy: string, direction: string) {
    return this.blogModel
      .find({ name: { $regex: new RegExp(filter, 'gi') } })
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: direction as BlogSortDirection })
      .lean();
  }
  async getBlogById(id: string): Promise<BlogDocument> {
    return this.blogModel.findById(id);
  }

  async getCountBlogs(filter: string) {
    return this.blogModel.countDocuments({
      name: { $regex: new RegExp(filter, 'gi') },
    });
  }
}
