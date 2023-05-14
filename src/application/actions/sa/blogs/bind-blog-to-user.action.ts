import { BadGatewayException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BingUserParamDto } from '../../../../domain/sa/blogs/dto/bing-user-param.dto';
import { QueryBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { MainBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';
import { UserEntity } from '../../../../domain/users/entities/user.entity';

@Injectable()
export class BindBlogToUserAction {
  constructor(
    @Inject(QueryBlogsRepository) private readonly blogRepository: QueryBlogsRepository,
    @Inject(MainBlogsRepository) private readonly mainBlogRepository: MainBlogsRepository,
    @Inject(UserQueryRepository) private readonly userRepository: UserQueryRepository,
  ) {}

  private async validate(param: BingUserParamDto): Promise<UserEntity> {
    const blog = await this.blogRepository.getBlogById(+param.id);
    if (!blog) {
      throw new NotFoundException();
    }

    if (blog.user) {
      throw new BadGatewayException([{ message: 'any text', field: 'blogId' }]);
    }
    return blog.user;
  }

  public async execute(param: BingUserParamDto) {
    const user = await this.validate(param);
    if (user.id === param.userId) return;

    await this.mainBlogRepository.bindUserToBlog(+param.id, user);
  }
}
