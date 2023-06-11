import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogger/create-blog.response';
import { BlogImagesTypeEnum } from '../../../domain/blogs/enums/blog-images-type.enum';
import { ConfigService } from '@nestjs/config';
import { BlogImagesEntity } from '../../../domain/blogs/entities/blog-images.entity';
import { CreateImagesResponse } from '../../../presentation/requests/blogger/create-images.response';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { SubscriptionStatusEnum } from '../../../domain/blogs/enums/subscription-status.enum';

@Injectable()
export class GetBlogByIdAction {
  logger = new Logger(GetBlogByIdAction.name);
  constructor(private readonly queryRepository: QueryBlogsRepository, private readonly configService: ConfigService) {}

  private prepareWallpaper(wallpaper: BlogImagesEntity[]) {
    if (!wallpaper.length) return null;
    return {
      ...wallpaper[0],
      url: this.configService.get('AWS_LINK') + wallpaper[0].path,
    };
  }

  private async prepareImages(blogId: number): Promise<CreateImagesResponse> {
    const [wallpaper, main] = await Promise.all([
      this.queryRepository.getBlogImages(blogId, BlogImagesTypeEnum.WALLPAPER),
      this.queryRepository.getBlogImages(blogId, BlogImagesTypeEnum.MAIN),
    ]);
    return {
      wallpaper: this.prepareWallpaper(wallpaper),
      main: main.map((item) => {
        return {
          ...item,
          url: this.configService.get('AWS_LINK') + item.path,
        };
      }),
    };
  }

  async execute(id: number, user: UserEntity): Promise<CreateBlogResponse> {
    const findBlog = await this.queryRepository.getBlogById(id).catch(() => {
      this.logger.error(`I can't find the blog. ID: ${id}`);
      throw new NotFoundException();
    });

    if (!findBlog || findBlog.isBanned) {
      throw new NotFoundException();
    }
    const [countSubscription, mySubscription] = await Promise.all([
      this.queryRepository.getCountSubscriptionForBlog(id),
      user?.id && this.queryRepository.statusSubscriptionForUser(user.id),
    ]);
    return plainToClass(CreateBlogResponse, {
      ...findBlog,
      id: findBlog.id.toString(),
      images: await this.prepareImages(id),
      currentUserSubscriptionStatus: mySubscription.status ?? SubscriptionStatusEnum.NONE,
      subscribersCount: countSubscription,
    });
  }
}
