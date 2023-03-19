import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { GetPostsRequest } from '../requests/posts/get-posts.request';
import { CreatePostRequest } from '../requests/posts/create-post.request';
import { GetPost, GetPostsResponse } from '../responses/posts/get-all-posts.response';
import { GetCommentsByPostIdResponse } from '../responses/posts/get-comments-by-postId.response';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';
import { GetPostByIdAction } from '../../application/actions/posts/get-post-by-id.action';
import { UpdatePostAction } from '../../application/actions/posts/update-post.action';
import { DeletePostAction } from '../../application/actions/posts/delete-post.action';
import { GetPostsAction } from '../../application/actions/posts/get-posts.action';
import { GetCommentsByPostIdAction } from '../../application/actions/posts/get-comments-by-postId.action';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly getPostsService: GetPostsAction,
    private readonly createService: CreatePostAction,
    private readonly getPostByIdService: GetPostByIdAction,
    private readonly updatePostService: UpdatePostAction,
    private readonly deletePostService: DeletePostAction,
    private readonly commentsByPostIdService: GetCommentsByPostIdAction,
  ) {}
  @Get()
  async getAllPosts(@Query() query: GetPostsRequest): Promise<GetPostsResponse> {
    return this.getPostsService.execute(query);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<GetPost> {
    return this.getPostByIdService.execute(id);
  }

  @Get(':id/comments')
  async getCommentsByPostId(
    @Param('id') id: string,
    @Query() query: GetPostsRequest,
  ): Promise<GetCommentsByPostIdResponse | any> {
    return this.commentsByPostIdService.execute(id, query);
  }

  @Post()
  async createPost(@Body() body: CreatePostRequest): Promise<GetPost> {
    return this.createService.execute(body);
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(@Param('id') id: string, @Body() body: CreatePostRequest): Promise<void> {
    return this.updatePostService.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePostById(@Param('id') id: string): Promise<void> {
    return this.deletePostService.execute(id);
  }
}
