import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogger/create-blog.response';
import { BlogImagesTypeEnum } from '../../../domain/blogs/enums/blog-images-type.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetBlogByIdAction {
  logger = new Logger(GetBlogByIdAction.name);
  constructor(private readonly queryRepository: QueryBlogsRepository, private readonly configService: ConfigService) {}

  private async prepareImages(blogId: number): Promise<CreateBlogResponse> {
    const [wallpaper, main] = await Promise.all([
      this.queryRepository.getBlogImages(blogId, BlogImagesTypeEnum.WALLPAPER),
      this.queryRepository.getBlogImages(blogId, BlogImagesTypeEnum.MAIN),
    ]);
    return plainToClass(CreateBlogResponse, {
      wallpaper: {
        ...wallpaper,
        url: this.configService.get('AWS_LINK') + wallpaper[0].path,
      },
      main: main.map((item) => {
        return {
          ...item,
          url: this.configService.get('AWS_LINK') + item.path,
        };
      }),
    });
  }

  async execute(id: number): Promise<CreateBlogResponse> {
    const findBlog = await this.queryRepository.getBlogById(id).catch(() => {
      this.logger.error(`I can't find the blog. ID: ${id}`);
      throw new NotFoundException();
    });

    if (!findBlog || findBlog.isBanned) {
      throw new NotFoundException();
    }
    return plainToClass(CreateBlogResponse, {
      ...findBlog,
      id: findBlog.id.toString(),
      images: await this.prepareImages(id),
    });
  }
}
