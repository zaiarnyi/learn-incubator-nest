import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryCommentsRepository } from '../../../infrastructure/database/repositories/comments/query-comments.repository';
import { plainToClass } from 'class-transformer';
import { CommentResponse } from '../../../presentation/responses/commentById.response';
import { StatusCommentEnum } from '../../../domain/posts/enums/status-comment.enum';

@Injectable()
export class GetCommentByIdAction {
  private logger = new Logger(GetCommentByIdAction.name);

  constructor(@Inject(QueryCommentsRepository) private readonly queryRepository: QueryCommentsRepository) {}

  private getLikesInfo() {
    return {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: StatusCommentEnum.None,
    };
  }

  public async execute(id: string): Promise<CommentResponse> {
    const comment = await this.queryRepository.getCommentById(id).catch((e) => {
      this.logger.error(`An error occurred when receiving comments with id - ${id}. ${JSON.stringify(e, null, 2)}`);
      throw new NotFoundException();
    });

    if (!comment) {
      throw new NotFoundException();
    }

    return plainToClass(CommentResponse, {
      ...comment.toObject(),
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      likesInfo: this.getLikesInfo(),
    });
  }
}
