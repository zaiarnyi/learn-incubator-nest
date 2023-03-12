import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../../../domain/posts/entities/post.entity';
import { SaveNewPostDto } from '../../../../domain/posts/dto/save-new-post.dto';

@Injectable()
export class MainPostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(post: SaveNewPostDto): Promise<PostDocument> {
    return this.postModel.create(post);
  }
}
