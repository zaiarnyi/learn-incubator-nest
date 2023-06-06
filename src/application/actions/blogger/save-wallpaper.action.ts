import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { S3Service } from '../../../infrastructure/external/modules/s3/s3.service';
import { join } from 'path';
import { CreateImagesResponse } from '../../../presentation/requests/blogger/create-images.response';
import { ImageService } from '../../../infrastructure/external/modules/images/image.service';
import { plainToClass } from 'class-transformer';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { BlogImagesTypeEnum } from '../../../domain/blogs/enums/blog-images-type.enum';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { BlogImagesEntity } from '../../../domain/blogs/entities/blog-images.entity';

@Injectable()
export class SaveWallpaperAction {
  constructor(
    private readonly s3Service: S3Service,
    private readonly imagesService: ImageService,
    private readonly blogRepository: MainBlogsRepository,
    private readonly queryBlogRepository: QueryBlogsRepository,
  ) {}

  private preparePath(type: string, userId: number, blogId: number, filename: string): string {
    return join('incubator', userId.toString(), 'blogs', blogId.toString(), type, filename);
  }

  public async execute(
    blogId: number,
    buffer: Buffer,
    filename: string,
    user: UserEntity,
  ): Promise<CreateImagesResponse> {
    const blog = await this.queryBlogRepository.getBlogById(blogId);
    if (blog) {
      throw new NotFoundException();
    }
    const wallpaperPath = this.preparePath('wallpaper', user.id, blogId, filename.replace(/\s/g, '_'));
    const wallpaperSize = await this.imagesService.detectSize(buffer);

    await Promise.all([
      this.s3Service.deleteObject(wallpaperPath),
      this.blogRepository.deleteImageForBlog(blogId, BlogImagesTypeEnum.WALLPAPER),
    ]);

    const blogImage = new BlogImagesEntity();
    blogImage.blog = blog;
    blogImage.type = BlogImagesTypeEnum.WALLPAPER;
    blogImage.width = wallpaperSize.width;
    blogImage.height = wallpaperSize.height;
    blogImage.fileSize = wallpaperSize.size;
    blogImage.path = wallpaperPath;

    const [wallpaperLink, mainImages] = await Promise.all([
      this.s3Service.uploadToS3(buffer, wallpaperPath),
      this.queryBlogRepository.getBlogImages(blogId, BlogImagesTypeEnum.MAIN),
      this.blogRepository.saveImageForBlog(blogImage),
    ]);

    return plainToClass(CreateImagesResponse, {
      wallpaper: {
        url: wallpaperLink,
        width: wallpaperSize.width,
        height: wallpaperSize.height,
        fileSize: wallpaperSize.size,
      },
      main: mainImages,
    });
  }
}
