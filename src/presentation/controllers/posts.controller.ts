import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { GetPostsRequest } from '../requests/posts/get-posts.request';
import { GetPost, GetPostsResponse } from '../responses/posts/get-all-posts.response';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';
import { GetPostByIdAction } from '../../application/actions/posts/get-post-by-id.action';
import { GetPostsAction } from '../../application/actions/posts/get-posts.action';
import { GetCommentsByPostIdAction } from '../../application/actions/posts/get-comments-by-postId.action';
import { JwtAuthOptionalGuard } from '../../domain/auth/guards/optional-jwt-auth.guard';
import { ChangeLikeStatusPostAction } from '../../application/actions/posts/change-like-status.action';
import { CreateCommentForPostAction } from '../../application/actions/posts/create-comment-for-post.action';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly getPostsService: GetPostsAction,
    private readonly createService: CreatePostAction,
    private readonly getPostByIdService: GetPostByIdAction,
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
  async getPostById(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<GetPost> {
    return this.getPostByIdService.execute(id, req?.user?.userId);
  }
  // @UseGuards(JwtAuthOptionalGuard)
  // @Get(':id/comments')
  // async getCommentsByPostId(
  //   @Param('id') id: string,
  //   @Query() query: GetPostsRequest,
  //   @Req() req: any,
  // ): Promise<GetCommentsByPostIdResponse> {
  //   return this.commentsByPostIdService.execute(id, query, req?.user?.userId);
  // }
  //
  // @UseGuards(JwtAuthGuard)
  // @Post(':id/comments')
  // async createCommentForPost(
  //   @Param('id') id: string,
  //   @Body() body: CreateCommentForPostRequest,
  //   @Req() req: any,
  // ): Promise<PostCommentInfo> {
  //   return this.createCommentForPostAction.execute(id, body, req.user.userId);
  // }
  //
  // @UseGuards(JwtAuthGuard)
  // @Put(':id/like-status')
  // @HttpCode(204)
  // async changeLikeStatusByPostId(
  //   @Param('id') id: string,
  //   @Body() body: ChangeLikeStatusPostByIdRequest,
  //   @Req() req: any,
  // ) {
  //   return this.changeLikeStatusByPostIdService.execute(id, body, req.user.userId);
  // }
}
