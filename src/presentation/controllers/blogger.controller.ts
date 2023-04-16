import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
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
import { GetBlogsRequestWithSearch } from '../requests/blogs/get-blogs.request';
import { CreateBlogRequest } from '../requests/blogger/create-blog.request';
import { CreatePostByBlogIdRequest } from '../requests/blogger/create-post-by-blogId.request';
import { ParamPostByBlogRequest } from '../requests/blogger/param-post-by-blog.request';
import { GetAllBlogsResponse } from '../responses/blogs/get-all-blogs.response';
import { UserQueryRepository } from '../../infrastructure/database/repositories/users/query.repository';
import { DeletePostByBlogIdAction } from '../../application/actions/blogger/delete-post-by-blogId.action';
import { UpdatePostByBlogAction } from '../../application/actions/blogger/update-post-by-blog.action';
import { JwtAuthOptionalGuard } from '../../domain/auth/guards/optional-jwt-auth.guard';

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
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('blogs')
  async getBlogs(@Query() query: GetBlogsRequestWithSearch, @Req() req: any): Promise<GetAllBlogsResponse> {
    return this.getBlogsService.execute(query, req.user.userId);
  }

  @UseGuards(JwtAuthOptionalGuard)
  @Post('blogs')
  async createBlog(@Body() body: CreateBlogRequest, @Req() req: any) {
    return this.createBlogService.execute(body, req?.user?.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('blogs/:blogId/posts')
  async createPostByBlog(@Body() body: CreatePostByBlogIdRequest, @Param('blogId') id: string, @Req() req: any) {
    return this.createPostService.execute({ ...body, blogId: id }, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('blogs/:id')
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() body: CreateBlogRequest, @Req() req: any) {
    return this.updateService.execute(id, body, req.user.userId);
  }

  @UseGuards(JwtAuthOptionalGuard)
  @Put('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  async updatePostByBlog(
    @Body() body: CreatePostByBlogIdRequest,
    @Param() params: ParamPostByBlogRequest,
    @Req() req: any,
  ) {
    return this.updatePostByBlogAction.execute({ ...body, blogId: params.blogId }, params.postId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('blogs/:id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string, @Req() req: any) {
    return this.deleteService.execute(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('blogs/:blogId/posts/:postId')
  @HttpCode(204)
  async deletePostByBlog(@Param() params: ParamPostByBlogRequest, @Req() req: any) {
    return this.deletePostAction.execute(params.blogId, params.postId, req.user.userId);
  }
}
