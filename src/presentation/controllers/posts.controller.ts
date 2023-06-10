import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetPostsRequest } from '../requests/posts/get-posts.request';
import { GetPost, GetPostsResponse } from '../responses/posts/get-all-posts.response';
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadRequestResponse } from '../responses/badRequest.response';

@Controller('posts')
@ApiTags('posts')
@ApiBadRequestResponse({ type: BadRequestResponse })
export class PostsController {
  constructor(
    private readonly getPostsService: GetPostsAction,
    private readonly getPostByIdService: GetPostByIdAction,
    private readonly commentsByPostIdService: GetCommentsByPostIdAction,
    private readonly changeLikeStatusByPostIdService: ChangeLikeStatusPostAction,
    private readonly createCommentForPostAction: CreateCommentForPostAction,
  ) {}
  @UseGuards(JwtAuthOptionalGuard)
  @Get()
  @ApiOperation({ summary: 'Returns all posts', description: 'Tokens optional' })
  @ApiOkResponse({ type: GetPostsResponse })
  async getAllPosts(@Query() query: GetPostsRequest, @Req() req: any): Promise<GetPostsResponse> {
    return this.getPostsService.execute(query, req?.user);
  }
  @UseGuards(JwtAuthOptionalGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Returns posts by id', description: 'Tokens optional' })
  @ApiParam({ name: 'id', example: 42, required: true, description: 'post id' })
  @ApiOkResponse({ type: GetPost })
  async getPostById(@Param('id') id: string, @Req() req: any): Promise<GetPost> {
    if (req?.user?.is_banned) {
      throw new NotFoundException();
    }
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.getPostByIdService.execute(Number(id), req?.user?.id);
  }
  @UseGuards(JwtAuthOptionalGuard)
  @Get('/:id/comments')
  @ApiOperation({ summary: 'Returns comments for post by id', description: 'Tokens optional' })
  @ApiParam({ name: 'id', example: 42, required: true, description: 'post id' })
  @ApiOkResponse({ type: GetCommentsByPostIdResponse })
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
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: "If post with specified postId doesn't exists" })
  @ApiOperation({ summary: 'Create comment for post by id' })
  @ApiParam({ name: 'id', example: 42, required: true, description: 'post id' })
  @ApiResponse({ type: PostCommentInfo, status: 201 })
  @Post(':id/comments')
  async createCommentForPost(
    @Param('id') id: string,
    @Body() body: CreateCommentForPostRequest,
    @Req() req: any,
  ): Promise<PostCommentInfo> {
    if (isNaN(Number(id)) || req?.user?.isBanned) {
      throw new NotFoundException();
    }
    return this.createCommentForPostAction.execute(Number(id), body, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/like-status')
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: "If post with specified postId doesn't exists" })
  @ApiOperation({ summary: 'Change like status for post by id' })
  @ApiParam({ name: 'id', example: 42, required: true, description: 'post id' })
  @ApiNoContentResponse()
  async changeLikeStatusByPostId(
    @Param('id') id: string,
    @Body() body: ChangeLikeStatusPostByIdRequest,
    @Req() req: any,
  ) {
    if (isNaN(Number(id)) || req?.user?.is_banned) {
      throw new NotFoundException();
    }
    return this.changeLikeStatusByPostIdService.execute(Number(id), body, req.user);
  }
}
