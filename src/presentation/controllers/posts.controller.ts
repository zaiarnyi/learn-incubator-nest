import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GetPostsRequest } from '../requests/posts/get-posts.request';
import { CreatePostRequest } from '../requests/posts/create-post.request';
import { GetPost, GetPostsResponse } from '../responses/posts/get-all-posts.response';
import { GetCommentsByPostIdResponse } from '../responses/posts/get-comments-by-postId.response';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';

@Controller('posts')
export class PostsController {
  constructor(private readonly createService: CreatePostAction) {}
  @Get()
  async getAllPosts(@Query() query: GetPostsRequest): Promise<GetPostsResponse | any> {
    return [];
  }

  @Get('id')
  async getPostById(@Param('id') id: string): Promise<GetPost | any> {}

  @Get(':id/comments')
  async getCommentsByPostId(
    @Param('id') id: string,
    @Query() query: GetPostsRequest,
  ): Promise<GetCommentsByPostIdResponse | any> {}

  @Post()
  async createPost(@Body() body: CreatePostRequest): Promise<GetPost | any> {
    return this.createService.execute(body);
  }

  @Put('id')
  async updatePost(@Param('id') id: string, @Body() body: CreatePostRequest): Promise<void> {}

  @Delete('id')
  async deletePostById(@Param('id') id: string): Promise<void> {}
}
