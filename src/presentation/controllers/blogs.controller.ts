import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { GetBlogsRequest, GetBlogsRequestWithSearch } from '../requests/blogs/get-blogs.request';
import { CreatePostRequest } from '../requests/blogs/create-post.request';
import { CreatePostByBlogIdRequest } from '../requests/blogs/create-post-by-blogId.request';
import { CreateBlogAction } from '../../application/actions/blogs/create-blog.action';
import { CreateBlogResponse } from '../responses/blogs/create-blog.response';
import { GetBlogByIdAction } from '../../application/actions/blogs/getBlogById.action';
import { UpdateBlogAction } from '../../application/actions/blogs/update-blog.action';
import { DeleteBlogByIdAction } from '../../application/actions/blogs/delete-blogById.action';
import { GetAllBlogsAction } from '../../application/actions/blogs/get-all-blogs.action';
import { GetAllBlogsResponse } from '../responses/blogs/get-all-blogs.response';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';
import { GetPostByBlogIdAction } from '../../application/actions/blogs/getPostByBlogId.action';
import { GetPostByBlogIdResponse } from '../responses/blogs/getPostByBlogId.response';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly getBlogsService: GetAllBlogsAction,
    private readonly createBlogService: CreateBlogAction,
    private readonly getByIdService: GetBlogByIdAction,
    private readonly updateService: UpdateBlogAction,
    private readonly deleteService: DeleteBlogByIdAction,
    private readonly createService: CreatePostAction,
    private readonly getPostByBlogIdService: GetPostByBlogIdAction,
  ) {}
  @Get()
  async getAllBlogs(@Query() query: GetBlogsRequestWithSearch): Promise<GetAllBlogsResponse> {
    return this.getBlogsService.execute(query);
  }

  @Get(':id/posts')
  async getPostByBlogId(@Param('id') id: string, @Query() query: GetBlogsRequest): Promise<GetPostByBlogIdResponse> {
    return this.getPostByBlogIdService.execute(id, query);
  }

  @Get('/:id')
  async getBlogById(@Param('id') id: string): Promise<CreateBlogResponse> {
    return this.getByIdService.execute(id);
  }

  @Post()
  async createBlog(@Body() body: CreatePostRequest): Promise<CreateBlogResponse> {
    return this.createBlogService.execute(body);
  }

  @Post('/:id/posts')
  async createPostByBlogId(@Param('id') id: string, @Body() body: CreatePostByBlogIdRequest) {
    return this.createService.execute({ ...body, blogId: id });
  }

  @Put('/:id')
  @HttpCode(204)
  async updateBlogById(@Param('id') id: string, @Body() body: CreatePostRequest) {
    return this.updateService.execute(id, body);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteBlogById(@Param('id') id: string) {
    return this.deleteService.execute(id);
  }
}
