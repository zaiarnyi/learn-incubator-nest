import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument, PostEntity } from '../../../../domain/posts/entities/post.entity';
import { SaveNewPostDto } from '../../../../domain/posts/dto/save-new-post.dto';
import { CreatePostDto } from '../../../../domain/posts/dto/create-post.dto';
import { DeleteResult } from 'mongodb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MainPostRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async createPost(post: PostEntity): Promise<PostEntity> {
    const query = `INSERT INTO posts (title, content, "user", "blog", "short_description")
              VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    return this.dataSource.query(query, [post.title, post.content, post.user, post.blog, post.short_description]);
  }
  async updatePost(id: string, payload: CreatePostDto): Promise<PostDocument> {
    return this.postModel.findOneAndUpdate({ _id: id }, payload);
  }

  async deletePost(id: string): Promise<PostDocument> {
    return this.postModel.findByIdAndDelete(id);
  }

  async deleteAllPosts(): Promise<DeleteResult> {
    return this.postModel.deleteMany();
  }
  async changeBannedStatus(userId: string, isBanned: boolean): Promise<any> {
    return this.postModel.updateMany({ userId }, { isBanned });
  }

  async changeBannedStatusByBlogger(userId: string, blogId: string, isBanned: boolean): Promise<any> {
    return this.postModel.updateMany({ userId, blogId }, { isBanned });
  }
}
