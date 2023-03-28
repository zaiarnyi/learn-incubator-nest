import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { GetCommentByIdAction } from '../../application/actions/comments/getCommentById.action';
import { CommentResponse } from '../responses/commentById.response';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentByIdService: GetCommentByIdAction) {}
  @Get('/:id')
  async getCommentById(@Param('id') id: string): Promise<CommentResponse> {
    return this.commentByIdService.execute(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async changeCommentById(@Param('id') id: string) {}

  @UseGuards(JwtAuthGuard)
  @Put('/:id/like-status')
  async changeLikeStatusByCommentId(@Param('id') id: string) {}
}
