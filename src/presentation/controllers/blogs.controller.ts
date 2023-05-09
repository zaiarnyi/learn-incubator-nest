import { Controller, Get, NotFoundException, Param, Query, Req, UseGuards } from '@nestjs/common';
import { GetBlogsRequest, GetBlogsRequestWithSearch } from '../requests/blogs/get-blogs.request';
import { CreateBlogResponse } from '../responses/blogger/create-blog.response';
import { GetBlogByIdAction } from '../../application/actions/blogs/getBlogById.action';
import { GetAllBlogsAction } from '../../application/actions/blogs/get-all-blogs.action';
import { GetAllBlogsResponse } from '../responses/blogger/get-all-blogs.response';
import { GetPostByBlogIdAction } from '../../application/actions/blogs/getPostByBlogId.action';
import { GetPostByBlogIdResponse } from '../responses/blogger/getPostByBlogId.response';
import { JwtAuthOptionalGuard } from '../../domain/auth/guards/optional-jwt-auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly getBlogsService: GetAllBlogsAction,
    private readonly getByIdService: GetBlogByIdAction,
    private readonly getPostByBlogIdService: GetPostByBlogIdAction,
  ) {}

  @Get()
  async getAllBlogs(@Query() query: GetBlogsRequestWithSearch): Promise<GetAllBlogsResponse> {
    return this.getBlogsService.execute(query);
  }

  @UseGuards(JwtAuthOptionalGuard)
  @Get('/:id/posts')
  async getPostByBlogId(
    @Param('id') id: string,
    @Query() query: GetBlogsRequest,
    @Req() req: any,
  ): Promise<GetPostByBlogIdResponse> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.getPostByBlogIdService.execute(Number(id), query, req?.user?.id);
  }

  @Get('/:id')
  async getBlogById(@Param('id') id: string): Promise<CreateBlogResponse> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.getByIdService.execute(Number(id));
  }
}
