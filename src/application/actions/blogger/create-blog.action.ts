import { CreateBlogDto } from '../../../domain/blogs/dto/create-blog.dto';
import { Blog } from '../../../domain/blogs/entities/blog.entity';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateBlogResponse } from '../../../presentation/responses/blogs/create-blog.response';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';

export class CreateBlogAction {
  constructor(
    @Inject(MainBlogsRepository)
    private readonly mainRepository: MainBlogsRepository,
    @Inject(UserMainRepository) private readonly userRepository: UserMainRepository,
    @Inject(UserQueryRepository) private readonly userQueryRepository: UserQueryRepository,
  ) {}

  async execute(payload: CreateBlogDto, userId: string): Promise<CreateBlogResponse> {
    const user = await this.userQueryRepository.getUserById(userId);
    const blog = new Blog();
    blog.name = payload.name;
    blog.description = payload.description;
    blog.websiteUrl = payload.websiteUrl;
    blog.userId = userId;
    blog.userLogin = user.login;

    const createdBlog = await this.mainRepository.createBlog(blog);

    return plainToClass(CreateBlogResponse, Object.assign(createdBlog, {}));
  }
}
