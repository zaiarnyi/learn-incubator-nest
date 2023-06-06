import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { CreateImageResponse } from '../../../presentation/requests/blogger/create-images.response';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';
import { join } from 'path';
import { ImageService } from '../../../infrastructure/external/modules/images/image.service';
import { PostImagesEntity } from '../../../domain/posts/entities/post-images.entity';
import { S3Service } from '../../../infrastructure/external/modules/s3/s3.service';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SavePostMainImageAction {
  constructor(
    private readonly postRepository: QueryPostRepository,
    private readonly mainPostRepository: MainPostRepository,
    private readonly imagesService: ImageService,
    private readonly s3Service: S3Service,
  ) {}

  private preparePath(userId: number, blogId: number, postId: number, filename = ''): string {
    return join('incubator', userId.toString(), 'blogs', blogId.toString(), 'posts', postId.toString(), filename);
  }
  public async execute(
    blogId: number,
    postId: number,
    buffer: Buffer,
    fileName: string,
    user: UserEntity,
  ): Promise<CreateImageResponse> {
    const post = await this.postRepository.getPostById(postId, ['blog', 'blog.user']);

    if (!post || post.blog.id !== blogId) {
      throw new NotFoundException();
    }

    if (post.blog.user.id !== user.id) {
      throw new ForbiddenException();
    }
    const path = this.preparePath(user.id, blogId, postId, fileName.replace(/\s/g, '_'));
    const mainSize = await this.imagesService.detectSize(buffer);

    const posImage = new PostImagesEntity();
    posImage.post = post;
    posImage.height = mainSize.height;
    posImage.width = mainSize.width;
    posImage.fileSize = mainSize.size;
    posImage.path = path;

    await Promise.all([this.s3Service.uploadToS3(buffer, path), this.mainPostRepository.savePostImage(posImage)]);

    const mainImages = await this.postRepository.getPostImages(postId);

    return plainToClass(CreateImageResponse, { main: mainImages });
  }
}
