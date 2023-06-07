import { Injectable } from '@nestjs/common';
import { PostEntity } from '../../../../domain/posts/entities/post.entity';
import { CreatePostDto } from '../../../../domain/posts/dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostImagesEntity } from '../../../../domain/posts/entities/post-images.entity';

@Injectable()
export class MainPostRepository {
  constructor(
    @InjectRepository(PostEntity) private readonly repository: Repository<PostEntity>,
    @InjectRepository(PostImagesEntity) private readonly postImageRepository: Repository<PostImagesEntity>,
  ) {}

  async createPost(post: PostEntity): Promise<PostEntity> {
    return this.repository.save(post);
  }
  async updatePost(id: number, payload: Omit<CreatePostDto, 'blogId'>) {
    return this.repository.update({ id }, payload);
  }

  async deletePost(id: number) {
    return this.repository.delete({ id });
  }

  async changeBannedStatus(userId: number, isBanned: boolean): Promise<any> {
    return this.repository.update({ user: { id: userId } }, { isBanned });
  }

  async changeBannedStatusByBlogger(userId: number, blogId: number, isBanned: boolean): Promise<any> {
    return this.repository.update({ user: { id: userId }, blog: { id: blogId } }, { isBanned });
  }

  async savePostImage(images: PostImagesEntity[]): Promise<PostImagesEntity[]> {
    return this.postImageRepository.save(images);
  }
}
