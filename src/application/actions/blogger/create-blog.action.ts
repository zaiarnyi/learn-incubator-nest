import { CreateBlogDto } from '../../../domain/blogs/dto/create-blog.dto';
import { Blog, BlogEntity } from '../../../domain/blogs/entities/blog.entity';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogger/create-blog.response';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';

export class CreateBlogAction {
  constructor(
    @Inject(MainBlogsRepository)
    private readonly mainRepository: MainBlogsRepository,
    @Inject(UserMainRepository) private readonly userRepository: UserMainRepository,
    @Inject(UserQueryRepository) private readonly userQueryRepository: UserQueryRepository,
  ) {}

  async execute(payload: CreateBlogDto, userId?: number): Promise<CreateBlogResponse> {
    const user = await this.userQueryRepository.getUserById(userId);
    const blog = new BlogEntity();
    blog.name = payload.name;
    blog.description = payload.description;
    blog.website_url = payload.websiteUrl;

    if (user) {
      blog.user = user;
    }

    const createdBlog = await this.mainRepository.createBlog(blog);

    return plainToClass(CreateBlogResponse, {
      id: createdBlog.id.toString(),
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.website_url,
      createdAt: createdBlog.createdAt,
      isMembership: createdBlog.is_membership,
    });
  }
}
