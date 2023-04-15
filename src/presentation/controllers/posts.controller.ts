import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { GetPostsRequest } from '../requests/posts/get-posts.request';
import { GetPost, GetPostsResponse } from '../responses/posts/get-all-posts.response';
import { GetCommentsByPostIdResponse, PostCommentInfo } from '../responses/posts/get-comments-by-postId.response';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';
import { GetPostByIdAction } from '../../application/actions/posts/get-post-by-id.action';
import { UpdatePostAction } from '../../application/actions/posts/update-post.action';
import { DeletePostAction } from '../../application/actions/posts/delete-post.action';
import { GetPostsAction } from '../../application/actions/posts/get-posts.action';
import { GetCommentsByPostIdAction } from '../../application/actions/posts/get-comments-by-postId.action';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';
import { ChangeLikeStatusPostByIdRequest } from '../../application/actions/posts/change-like-status-post-by-id.request';
import { JwtAuthOptionalGuard } from '../../domain/auth/guards/optional-jwt-auth.guard';
import { ChangeLikeStatusPostAction } from '../../application/actions/posts/change-like-status.action';
import { CreateCommentForPostRequest } from '../requests/posts/create-comment-for-post.request';
import { CreateCommentForPostAction } from '../../application/actions/posts/create-comment-for-post.action';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly getPostsService: GetPostsAction,
    private readonly createService: CreatePostAction,
    private readonly getPostByIdService: GetPostByIdAction,
    private readonly updatePostService: UpdatePostAction,
    private readonly deletePostService: DeletePostAction,
    private readonly commentsByPostIdService: GetCommentsByPostIdAction,
    private readonly changeLikeStatusByPostIdService: ChangeLikeStatusPostAction,
    private readonly createCommentForPostAction: CreateCommentForPostAction,
  ) {}
  @UseGuards(JwtAuthOptionalGuard)
  @Get()
  async getAllPosts(@Query() query: GetPostsRequest, @Req() req: any): Promise<GetPostsResponse> {
    return this.getPostsService.execute(query, req?.user?.userId);
  }
  @UseGuards(JwtAuthOptionalGuard)
  @Get(':id')
  async getPostById(@Param('id') id: string, @Req() req: any): Promise<GetPost> {
    return this.getPostByIdService.execute(id, req?.user?.userId);
  }
  @UseGuards(JwtAuthOptionalGuard)
  @Get(':id/comments')
  async getCommentsByPostId(
    @Param('id') id: string,
    @Query() query: GetPostsRequest,
    @Req() req: any,
  ): Promise<GetCommentsByPostIdResponse> {
    return this.commentsByPostIdService.execute(id, query, req?.user?.userId);
  }
  // @UseGuards(BasicAuthGuard)
  // @Post()
  // async createPost(@Body() body: CreatePostRequest, @Req() req: any): Promise<GetPost> {
  //   return this.createService.execute(body, req?.user?.userId);
  // }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createCommentForPost(
    @Param('id') id: string,
    @Body() body: CreateCommentForPostRequest,
    @Req() req: any,
  ): Promise<PostCommentInfo> {
    return this.createCommentForPostAction.execute(id, body, req.user.userId);
  }

  // @UseGuards(BasicAuthGuard)
  // @Put(':id')
  // @HttpCode(204)
  // async updatePost(@Param('id') id: string, @Body() body: CreatePostRequest): Promise<void> {
  //   return this.updatePostService.execute(id, body);
  // }

  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(204)
  async changeLikeStatusByPostId(
    @Param('id') id: string,
    @Body() body: ChangeLikeStatusPostByIdRequest,
    @Req() req: any,
  ) {
    return this.changeLikeStatusByPostIdService.execute(id, body, req.user.userId);
  }

  // @UseGuards(BasicAuthGuard)
  // @Delete(':id')
  // @HttpCode(204)
  // async deletePostById(@Param('id') id: string): Promise<void> {
  //   return this.deletePostService.execute(id);
  // }
}
