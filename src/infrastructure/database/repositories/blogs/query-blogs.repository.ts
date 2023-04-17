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
  ): Promise<BlogDocument[]> {
    return this.blogModel
      .find({ name: { $regex: new RegExp(filter, 'gi'), ...(userId && { bloggerId: userId }) }, isBanned: false })
      .sort({ [sortBy]: direction as BlogSortDirection })
      .skip(skip)
      .limit(limit)
      .lean();
  }
  async getBlogById(id: string): Promise<BlogDocument> {
    return this.blogModel.findById(id);
  }

  async getPostsCount(blogId: string): Promise<number> {
    return this.postModel.count({ blogId, isBanned: false });
  }

  async getCountBlogs(filter?: string, userId?: string) {
    const filterParam: { bloggerId?: string; name?: any; isBanned: boolean } = { isBanned: false };
    if (filter) {
      filterParam.name = { $regex: new RegExp(filter, 'gi') };
    }
    if (userId) {
      filterParam.bloggerId = userId;
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
}
