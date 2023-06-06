import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from '../../../infrastructure/external/modules/s3/s3.service';
import { ImageService } from '../../../infrastructure/external/modules/images/image.service';
import { join } from 'path';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { CreateImagesResponse } from '../../../presentation/requests/blogger/create-images.response';
import { plainToClass } from 'class-transformer';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { BlogImagesTypeEnum } from '../../../domain/blogs/enums/blog-images-type.enum';
import { BlogImagesEntity } from '../../../domain/blogs/entities/blog-images.entity';

@Injectable()
export class SaveBlogMainImageAction {
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

    const mainPath = this.preparePath('main', user.id, blogId, filename.replace(/\s/g, '_'));
    const mainSize = await this.imagesService.detectSize(buffer);

    const blogImage = new BlogImagesEntity();
    blogImage.blog = blog;
    blogImage.type = BlogImagesTypeEnum.WALLPAPER;
    blogImage.width = mainSize.width;
    blogImage.height = mainSize.height;
    blogImage.fileSize = mainSize.size;
    blogImage.path = mainPath;

    const [mainLink, wallpaperImage] = await Promise.all([
      this.s3Service.uploadToS3(buffer, mainPath),
      this.queryBlogRepository.getBlogImages(blogId, BlogImagesTypeEnum.MAIN),
      this.blogRepository.saveImageForBlog(blogImage),
    ]);

    return plainToClass(CreateImagesResponse, {
      wallpaper: wallpaperImage,
      main: [
        {
          url: mainLink,
          width: mainSize.width,
          height: mainSize.height,
          fileSize: mainSize.size,
        },
      ],
    });
  }
}
