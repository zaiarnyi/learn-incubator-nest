import { Controller, Get, Param } from '@nestjs/common';
import { GetCommentByIdAction } from '../../application/actions/comments/getCommentById.action';
import { CommentResponse } from '../responses/commentById.response';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentByIdService: GetCommentByIdAction) {}
  @Get('/:id')
  async getCommentById(@Param('id') id: string): Promise<CommentResponse> {
    return this.commentByIdService.execute(id);
  }
}
