import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../../../../domain/blogs/entities/blog.entity';
import { Model } from 'mongoose';
import { BlogSortDirection } from '../../../../domain/blogs/enums/blog-sort.enum';
import { Post, PostDocument } from '../../../../domain/posts/entities/post.entity';

@Injectable()
export class QueryBlogsRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async getBlogs(
    filter: string,
    skip: number,
    limit: number,
    sortBy: string,
    direction: string,
  ): Promise<BlogDocument[]> {
    return this.blogModel
      .find({ name: { $regex: new RegExp(filter, 'gi') } })
      .sort({ [sortBy]: direction as BlogSortDirection })
      .skip(skip)
      .limit(limit)
      .lean();
  }
  async getBlogById(id: string): Promise<BlogDocument> {
    return this.blogModel.findById(id);
  }

  async getPostsCount(): Promise<number> {
    return this.blogModel.count();
  }

  async getCountBlogs(filter?: string) {
    let filterParam = {};
    if (filter) {
      filterParam = {
        name: { $regex: new RegExp(filter, 'gi') },
      };
    }
    return this.blogModel.countDocuments(filterParam);
  }

  async getPostByBlogId(
    id: string,
    skip: number,
    limit: number,
    sortBy: string,
    direction: string,
  ): Promise<PostDocument[]> {
    return this.postModel
      .find({ blogId: id })
      .sort({ [sortBy]: direction as BlogSortDirection })
      .skip(skip)
      .limit(limit)
      .lean();
  }
}
