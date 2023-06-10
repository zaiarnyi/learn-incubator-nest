import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetCommentByIdAction } from '../../application/actions/comments/getCommentById.action';
import { CommentResponse } from '../responses/commentById.response';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';
import { ChangeCommentByIdRequest } from '../requests/comments/change-comment-by-id.request';
import { ChangeCommentByIdAction } from '../../application/actions/comments/change-comment-by-id.action';
import { DeleteCommentByIdAction } from '../../application/actions/comments/delete-comment-by-id.action';
import { ChangeLikeStatusCommentByIdRequest } from '../requests/comments/change-like-status-comment-by-id.request';
import { ChangeLikeStatusByCommentIdAction } from '../../application/actions/comments/change-like-status-by-commentId.action';
import { JwtAuthOptionalGuard } from '../../domain/auth/guards/optional-jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(
    @Inject(GetCommentByIdAction) private readonly commentByIdService: GetCommentByIdAction,
    @Inject(ChangeCommentByIdAction) private readonly changeCommentByIdService: ChangeCommentByIdAction,
    @Inject(DeleteCommentByIdAction) private readonly deleteCommentByIdService: DeleteCommentByIdAction,
    @Inject(ChangeLikeStatusByCommentIdAction)
    private readonly changeLikeStatusService: ChangeLikeStatusByCommentIdAction,
  ) {}

  @UseGuards(JwtAuthOptionalGuard)
  @Get('/:id')
  async getCommentById(@Param('id') id: string, @Req() req: any): Promise<CommentResponse> {
    if (isNaN(Number(id)) || req?.user?.isBanned) {
      throw new NotFoundException();
    }
    return this.commentByIdService.execute(Number(id), req?.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  @HttpCode(204)
  async changeCommentById(@Param('id') id: string, @Body() body: ChangeCommentByIdRequest, @Req() req: any) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.changeCommentByIdService.execute(Number(id), body, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put('/:id/like-status')
  async changeLikeStatusByCommentId(
    @Param('id') id: string,
    @Body() body: ChangeLikeStatusCommentByIdRequest,
    @Req() req: any,
  ) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.changeLikeStatusService.execute(Number(id), req.user, body);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete('/:id')
  async removeCommentById(@Param('id') id: string, @Req() req: any) {
    if (isNaN(Number(id))) {
      throw new NotFoundException();
    }
    return this.deleteCommentByIdService.execute(Number(id), req.user.id);
  }
}
