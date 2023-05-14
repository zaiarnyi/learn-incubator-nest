import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';
import { GetAllBlogsAction } from '../../application/actions/blogs/get-all-blogs.action';
import { CreateBlogAction } from '../../application/actions/blogger/create-blog.action';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';
import { UpdateBlogAction } from '../../application/actions/blogger/update-blog.action';
import { DeleteBlogByIdAction } from '../../application/actions/blogger/delete-blogById.action';
import { GetBlogsRequest, GetBlogsRequestWithSearch } from '../requests/blogs/get-blogs.request';
import { CreateBlogRequest } from '../requests/blogger/create-blog.request';
import { CreatePostByBlogIdRequest } from '../requests/blogger/create-post-by-blogId.request';
import { ParamPostByBlogRequest } from '../requests/blogger/param-post-by-blog.request';
import { GetAllBlogsResponse } from '../responses/blogger/get-all-blogs.response';
import { UserQueryRepository } from '../../infrastructure/database/repositories/users/query.repository';
import { DeletePostByBlogIdAction } from '../../application/actions/blogger/delete-post-by-blogId.action';
import { UpdatePostByBlogAction } from '../../application/actions/blogger/update-post-by-blog.action';
import { CheckBlogIdRequest } from '../requests/blogger/check-blog-id.request';
import { UserBannedByBlogRequest } from '../requests/blogger/user-banned-by-blog.request';
import { GetUserBannedByBlogResponse } from '../responses/blogger/get-user-banned-by-blog.response';
import { GetCommentsByBlogResponse } from '../responses/blogger/get-comments-by-blog.response';
import { GetCommentsByBlogsAction } from '../../application/actions/blogger/get-comments-by-blogs.action';
import { GetBannedUserAction } from '../../application/actions/blogger/users/get-banned-user.action';
import { GetBannedUserByBloggerRequest } from '../requests/blogger/get-banned-user-by-blogger.request';
import { BannedUserByBloggerAction } from '../../application/actions/blogger/users/banned-user-by-blogger.action';

@UseGuards(JwtAuthGuard)
@Controller('blogger')
export class BloggerController {
  constructor(
    @Inject(GetAllBlogsAction) private readonly getBlogsService: GetAllBlogsAction,
    @Inject(CreateBlogAction) private readonly createBlogService: CreateBlogAction,
    @Inject(CreatePostAction) private readonly createPostService: CreatePostAction,
    @Inject(UpdateBlogAction) private readonly updateService: UpdateBlogAction,
    @Inject(DeleteBlogByIdAction) private readonly deleteService: DeleteBlogByIdAction,
    @Inject(UserQueryRepository) private readonly queryUserRepository: UserQueryRepository,
    @Inject(DeletePostByBlogIdAction) private readonly deletePostAction: DeletePostByBlogIdAction,
    @Inject(UpdatePostByBlogAction) private readonly updatePostByBlogAction: UpdatePostByBlogAction,
    @Inject(GetCommentsByBlogsAction) private readonly getCommentsAction: GetCommentsByBlogsAction,
    @Inject(GetBannedUserAction) private readonly getBannedUserAction: GetBannedUserAction,
    @Inject(BannedUserByBloggerAction) private readonly changeBannedStatusUserAction: BannedUserByBloggerAction,
  ) {}
  @Get('blogs')
  async getBlogs(@Query() query: GetBlogsRequestWithSearch, @Req() req: any): Promise<GetAllBlogsResponse> {
    return this.getBlogsService.execute(query, req?.user?.id);
  }

  @Get('blogs/comments')
  async getCommentsByBlog(@Query() query: GetBlogsRequest, @Req() req: any): Promise<GetCommentsByBlogResponse> {
    return this.getCommentsAction.execute(query, req.user.id);
  }

  @Get('users/blog/:id')
  async getBannedUsersByBlog(
    @Query() query: GetBannedUserByBloggerRequest,
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<GetUserBannedByBlogResponse> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.getBannedUserAction.execute(Number(id), query, req.user.id);
  }

  @Post('blogs')
  async createBlog(@Body() body: CreateBlogRequest, @Req() req: any) {
    return this.createBlogService.execute(body, req.user);
  }

  @Post('blogs/:blogId/posts')
  async createPostByBlog(@Body() body: CreatePostByBlogIdRequest, @Param('blogId') id: string, @Req() req: any) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.createPostService.execute({ ...body, blogId: Number(id) }, req?.user);
  }

  @Put('blogs/:id')
  @HttpCode(204)
  async updateBlog(@Param() param: CheckBlogIdRequest, @Body() body: CreateBlogRequest, @Req() req: any) {
    return this.updateService.execute(param.id, body, req?.user);
  }

  @Put('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  async updatePostByBlog(
    @Body() body: CreatePostByBlogIdRequest,
    @Param() params: ParamPostByBlogRequest,
    @Req() req: any,
  ) {
    if (isNaN(Number(params.postId))) {
      throw new NotFoundException();
    }
    return this.updatePostByBlogAction.execute(
      { ...body, blogId: params.blogId },
      Number(params.postId),
      req?.user?.id,
    );
  }

  @Put('users/:id/ban')
  @HttpCode(204)
  async setBanToUser(@Param('id') id: string, @Body() body: UserBannedByBlogRequest, @Req() req: any): Promise<void> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    await this.changeBannedStatusUserAction.execute(Number(id), body, req.user.id);
  }

  @Delete('blogs/:id')
  @HttpCode(204)
  async deleteBlog(@Param() param: CheckBlogIdRequest, @Req() req: any) {
    return this.deleteService.execute(param.id, req?.user?.id);
  }

  @Delete('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  async deletePostByBlog(@Param() params: ParamPostByBlogRequest, @Req() req: any) {
    if (isNaN(Number(params.postId))) {
      throw new NotFoundException();
    }
    return this.deletePostAction.execute(params.blogId, Number(params.postId), req?.user?.id);
  }
}
