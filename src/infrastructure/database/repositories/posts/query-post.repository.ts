import { Injectable } from '@nestjs/common';
import { Blog, BlogDocument } from '../../../../domain/blogs/entities/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../../../domain/posts/entities/post.entity';
import { PostSortDirection } from '../../../../domain/posts/enums/sort.enum';
import { CommentDocument, Comment } from '../../../../domain/comments/entities/comment.entity';

@Injectable()
export class QueryPostRepository {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async getCountPosts(): Promise<number> {
    return this.postModel.find().count({ isBanned: false });
  }
  async getPost(limit: number, offset: number, sortBy: string, direction: string): Promise<PostDocument[]> {
    return this.postModel
      .find({ isBanned: false })
      .sort({ [sortBy]: direction as PostSortDirection })
      .skip(offset)
      .limit(limit)
      .lean();
  }
  async getPostByBlogId(id: string): Promise<BlogDocument> {
    return this.blogModel.findOne({ _id: id, isBanned: false });
  }

  async getPostById(id: string): Promise<PostDocument> {
    return this.postModel.findOne({ _id: id, isBanned: false });
  }

  async getAllPostById(id: string): Promise<PostDocument> {
    return this.postModel.findOne({ _id: id });
  }
}
