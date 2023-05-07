import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetPostsRequest } from '../requests/posts/get-posts.request';
import { GetPost, GetPostsResponse } from '../responses/posts/get-all-posts.response';
import { CreatePostAction } from '../../application/actions/posts/create-post.action';
import { GetPostByIdAction } from '../../application/actions/posts/get-post-by-id.action';
import { GetPostsAction } from '../../application/actions/posts/get-posts.action';
import { GetCommentsByPostIdAction } from '../../application/actions/posts/get-comments-by-postId.action';
import { JwtAuthOptionalGuard } from '../../domain/auth/guards/optional-jwt-auth.guard';
import { ChangeLikeStatusPostAction } from '../../application/actions/posts/change-like-status.action';
import { CreateCommentForPostAction } from '../../application/actions/posts/create-comment-for-post.action';
import { GetCommentsByPostIdResponse, PostCommentInfo } from '../responses/posts/get-comments-by-postId.response';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';
import { CreateCommentForPostRequest } from '../requests/posts/create-comment-for-post.request';
import { ChangeLikeStatusPostByIdRequest } from '../../application/actions/posts/change-like-status-post-by-id.request';

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
    return this.getPostsService.execute(query, req?.user?.id);
  }
  @UseGuards(JwtAuthOptionalGuard)
  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<GetPost> {
    if (req?.user?.is_banned) {
      throw new NotFoundException();
    }
    return this.getPostByIdService.execute(id, req?.user?.id);
  }
  @UseGuards(JwtAuthOptionalGuard)
  @Get('/:id/comments')
  async getCommentsByPostId(
    @Param('id') id: string,
    @Query() query: GetPostsRequest,
    @Req() req: any,
  ): Promise<GetCommentsByPostIdResponse> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.commentsByPostIdService.execute(Number(id), query, req?.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async createCommentForPost(
    @Param('id') id: string,
    @Body() body: CreateCommentForPostRequest,
    @Req() req: any,
  ): Promise<PostCommentInfo> {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.createCommentForPostAction.execute(Number(id), body, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(204)
  async changeLikeStatusByPostId(
    @Param('id') id: string,
    @Body() body: ChangeLikeStatusPostByIdRequest,
    @Req() req: any,
  ) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.changeLikeStatusByPostIdService.execute(Number(id), body, req.user.id);
  }
}
