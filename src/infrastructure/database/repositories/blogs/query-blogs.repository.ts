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
    userId?: string,
    anyFilter?: any,
  ): Promise<BlogDocument[]> {
    let findFilter: Record<string, any> = { name: { $regex: new RegExp(filter, 'gi') }, isBanned: false };
    if (userId) {
      findFilter.userId = userId;
    }
    if (anyFilter) {
      findFilter = {
        ...findFilter,
        ...anyFilter,
      };
    }
    return this.blogModel
      .find(findFilter)
      .sort({ [sortBy]: direction as BlogSortDirection })
      .skip(skip)
      .limit(limit)
      .lean();
  }
  async getBlogById(id: string): Promise<BlogDocument> {
    return this.blogModel.findOne({ _id: id });
  }

  async getPostsCount(blogId: string): Promise<number> {
    return this.postModel.count({ blogId, isBanned: false });
  }

  async getCountBlogs(filter?: string, userId?: string, anyFilter?: any) {
    let filterParam: Record<string, any> = { isBanned: false };
    if (filter) {
      filterParam.name = { $regex: new RegExp(filter, 'gi') };
    }
    if (userId) {
      filterParam.userId = userId;
    }

    if (anyFilter) {
      filterParam = {
        ...filterParam,
        ...anyFilter,
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
      .find({ blogId: id, isBanned: false })
      .sort({ [sortBy]: direction as BlogSortDirection })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async getBlogsByBlogger(userId: string): Promise<string[]> {
    const blogs = await this.blogModel.find({ userId });
    return blogs.map((item) => item._id.toString());
  }
}
