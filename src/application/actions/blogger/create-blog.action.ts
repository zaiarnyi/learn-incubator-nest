import { CreateBlogDto } from '../../../domain/blogs/dto/create-blog.dto';
import { Blog } from '../../../domain/blogs/entities/blog.entity';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogs/create-blog.response';
import { JwtService } from '@nestjs/jwt';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { ConfigService } from '@nestjs/config';

export class CreateBlogAction {
  constructor(
    @Inject(MainBlogsRepository)
    private readonly mainRepository: MainBlogsRepository,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(UserMainRepository) private readonly userRepository: UserMainRepository,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async execute(payload: CreateBlogDto, userId: string): Promise<CreateBlogResponse> {
    const blog = new Blog();
    blog.name = payload.name;
    blog.description = payload.description;
    blog.websiteUrl = payload.websiteUrl;
    blog.userId = userId;

    const createdBlog = await this.mainRepository.createBlog(blog);

    return plainToClass(CreateBlogResponse, {
      ...createdBlog.toObject(),
      id: createdBlog._id.toString(),
    });
  }
}
