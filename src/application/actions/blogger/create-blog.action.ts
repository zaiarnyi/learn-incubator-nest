import { CreateBlogDto } from '../../../domain/blogs/dto/create-blog.dto';
import { BlogEntity } from '../../../domain/blogs/entities/blog.entity';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogger/create-blog.response';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { UserEntity } from '../../../domain/users/entities/user.entity';

export class CreateBlogAction {
  constructor(
    @Inject(MainBlogsRepository)
    private readonly mainRepository: MainBlogsRepository,
    @Inject(UserMainRepository) private readonly userRepository: UserMainRepository,
    @Inject(UserQueryRepository) private readonly userQueryRepository: UserQueryRepository,
  ) {}

  async execute(payload: CreateBlogDto, user: UserEntity): Promise<CreateBlogResponse> {
    const blog = new BlogEntity();
    blog.name = payload.name;
    blog.description = payload.description;
    blog.websiteUrl = payload.websiteUrl;
    blog.user = user;

    const createdBlog = await this.mainRepository.createBlog(blog);

    return plainToClass(CreateBlogResponse, {
      ...createdBlog,
      id: createdBlog.id.toString(),
    });
  }
}
