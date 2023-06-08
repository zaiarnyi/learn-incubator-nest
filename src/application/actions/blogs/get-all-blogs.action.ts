import { Inject, Injectable } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { GetBlogsDto } from '../../../domain/blogs/dto/get-blogs.dto';
import { GetAllBlogsResponse } from '../../../presentation/responses/blogger/get-all-blogs.response';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogger/create-blog.response';
import { BlogImagesTypeEnum } from '../../../domain/blogs/enums/blog-images-type.enum';
import { ConfigService } from '@nestjs/config';
import { CreateImageItem, CreateImagesResponse } from '../../../presentation/requests/blogger/create-images.response';
import { BlogImagesEntity } from '../../../domain/blogs/entities/blog-images.entity';

@Injectable()
export class GetAllBlogsAction {
  constructor(
    @Inject(QueryBlogsRepository)
    private readonly queryRepository: QueryBlogsRepository,
    private readonly configService: ConfigService,
  ) {}

  private prepareWallpaper(wallpaper: BlogImagesEntity[]): CreateImageItem {
    console.log(wallpaper, 'wallpaper');
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

  public async execute(query: GetBlogsDto, userId?: number): Promise<GetAllBlogsResponse> {
    console.log(query, 'query');
    const skip = (query.pageNumber - 1) * query.pageSize;
    const [blogs, totalCount] = await this.queryRepository.getBlogs(
      query.searchNameTerm,
      skip,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
      userId,
      null,
      false,
    );

    const pagesCount = Math.ceil(totalCount / query.pageSize);

    const promises = blogs.map(async (item) => {
      return plainToClass(CreateBlogResponse, {
        ...item,
        id: item.id.toString(),
        images: await this.prepareImages(item.id),
      });
    });

    return {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: await Promise.all(promises),
    };
  }
}
