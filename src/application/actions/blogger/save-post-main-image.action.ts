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
import { PostEntity } from '../../../domain/posts/entities/post.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SavePostMainImageAction {
  constructor(
    private readonly postRepository: QueryPostRepository,
    private readonly mainPostRepository: MainPostRepository,
    private readonly imagesService: ImageService,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  private prepareImagesSizes(
    post: PostEntity,
    width: number,
    height: number,
    size: number,
    path: string,
  ): PostImagesEntity {
    const posImage = new PostImagesEntity();
    posImage.post = post;
    posImage.height = height;
    posImage.width = width;
    posImage.fileSize = size;
    posImage.path = path;

    return posImage;
  }

  private preparePath(userId: number, blogId: number, postId: number, size: string, filename = ''): string {
    return join('incubator', userId.toString(), 'blogs', blogId.toString(), 'posts', postId.toString(), size, filename);
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
    const pathOriginal = this.preparePath(user.id, blogId, postId, '940x432', fileName.replace(/\s/g, '_'));
    const pathMedium = this.preparePath(user.id, blogId, postId, '300x180', fileName.replace(/\s/g, '_'));
    const pathSmall = this.preparePath(user.id, blogId, postId, '149x96', fileName.replace(/\s/g, '_'));

    const mainMiddleImage = await this.imagesService.toSize(buffer, 300, 180);
    const mainSmallImage = await this.imagesService.toSize(buffer, 149, 96);

    const mainSizeOriginal = await this.imagesService.detectSize(buffer);
    const mainSizeMiddle = await this.imagesService.detectSize(mainMiddleImage);
    const mainSizeSmall = await this.imagesService.detectSize(mainSmallImage);

    const imageOriginal = this.prepareImagesSizes(post, 940, 432, mainSizeOriginal.size, pathOriginal);
    const imageMedium = this.prepareImagesSizes(post, 300, 180, mainSizeMiddle.size, pathMedium);
    const imageSmall = this.prepareImagesSizes(post, 149, 96, mainSizeSmall.size, pathSmall);

    const [images] = await Promise.all([
      this.mainPostRepository.savePostImage([imageOriginal, imageMedium, imageSmall]),
      this.s3Service.uploadToS3(buffer, pathOriginal),
      this.s3Service.uploadToS3(buffer, pathMedium),
      this.s3Service.uploadToS3(buffer, pathSmall),
    ]);

    return plainToClass(CreateImageResponse, {
      main: images.map((item) => ({
        ...item,
        url: this.configService.get('AWS_LINK') + item.path,
      })),
    });
  }
}
