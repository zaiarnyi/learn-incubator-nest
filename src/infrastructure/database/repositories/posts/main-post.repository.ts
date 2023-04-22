import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../../../domain/posts/entities/post.entity';
import { SaveNewPostDto } from '../../../../domain/posts/dto/save-new-post.dto';
import { CreatePostDto } from '../../../../domain/posts/dto/create-post.dto';

@Injectable()
export class MainPostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(post: SaveNewPostDto): Promise<PostDocument> {
    return this.postModel.create(post);
  }
  async updatePost(id: string, payload: CreatePostDto): Promise<PostDocument> {
    return this.postModel.findOneAndUpdate({ _id: id }, payload);
  }

  async deletePost(id: string): Promise<PostDocument> {
    return this.postModel.findByIdAndDelete(id);
  }

  async deleteAllPosts() {
    return this.postModel.deleteMany();
  }
  async changeBannedStatus(userId: string, isBanned: boolean) {
    return this.postModel.updateMany({ userId }, { isBanned });
  }

  async changeBannedStatusByBlogger(userId: string, blogId: string, isBanned: boolean) {
    return this.postModel.updateMany({ userId, blogId }, { isBanned });
  }
}
