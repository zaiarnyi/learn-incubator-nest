import { Controller, Get, HttpCode, Inject, Param, Put, Query, UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '../../../../domain/auth/guards/basic-auth.guard';
import { ParamBindUserRequest } from '../../../requests/sa/blogs/param-bind-user.request';
import { GetBlogListRequest } from '../../../requests/sa/blogs/get-blog-list.request';
import { GetBlogsWithOwnerResponse } from '../../../responses/sa/blogs/get-blogs.response';
import { GetBlogsActions } from '../../../../application/actions/sa/blogs/get-blogs.actions';
import { BindBlogToUserAction } from '../../../../application/actions/sa/blogs/bind-blog-to-user.action';

@UseGuards(BasicAuthGuard)
@Controller('sa/blogs')
export class SaBlogsControllers {
  constructor(
    @Inject(GetBlogsActions) private readonly getBlogsAction: GetBlogsActions,
    @Inject(BindBlogToUserAction) private readonly bindBlogAction: BindBlogToUserAction,
  ) {}

  @Get()
  async getBlogs(@Query() query: GetBlogListRequest): Promise<GetBlogsWithOwnerResponse> {
    console.log(query, 'query- getBlogs');
    return this.getBlogsAction.execute(query);
  }

  @Put(':id/bind-with-user/:userId')
  @HttpCode(204)
  async bindUserToBlog(@Param() param: ParamBindUserRequest) {
    return this.bindBlogAction.execute(param);
  }
}
