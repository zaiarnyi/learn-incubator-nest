import { BadGatewayException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BingUserParamDto } from '../../../../domain/sa/blogs/dto/bing-user-param.dto';
import { QueryBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { MainBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';

@Injectable()
export class BindBlogToUserAction {
  constructor(
    @Inject(QueryBlogsRepository) private readonly blogRepository: QueryBlogsRepository,
    @Inject(MainBlogsRepository) private readonly mainBlogRepository: MainBlogsRepository,
    @Inject(UserQueryRepository) private readonly userRepository: UserQueryRepository,
  ) {}

  private async validate(param: BingUserParamDto): Promise<boolean> {
    const blog = await this.blogRepository.getBlogById(param.id);
    if (!blog) {
      throw new NotFoundException();
    }

    if (blog.userId.length) {
      throw new BadGatewayException([{ message: 'any text', field: 'blogId' }]);
    }
    return blog.userId === param.userId;
  }

  public async execute(param: BingUserParamDto) {
    if (await this.validate(param)) return;

    const user = await this.userRepository.getUserById(param.userId as number);

    if (!user) {
      throw new BadGatewayException([{ message: 'any text', field: 'userId' }]);
    }
    await this.mainBlogRepository.bindUserToBlog(param.id, param.userId as string, user.login);
  }
}
