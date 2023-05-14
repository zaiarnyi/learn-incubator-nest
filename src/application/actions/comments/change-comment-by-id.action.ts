import { BadRequestException, ForbiddenException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { MainCommentsRepository } from '../../../infrastructure/database/repositories/comments/main-comments.repository';
import { QueryCommentsRepository } from '../../../infrastructure/database/repositories/comments/query-comments.repository';
import { ChangeCommentByIdDto } from '../../../domain/comments/dto/change-comment-by-id.dto';
import { validateOrReject } from 'class-validator';

export class ChangeCommentByIdAction {
  private logger = new Logger(ChangeCommentByIdAction.name);
  constructor(
    @Inject(MainCommentsRepository) private readonly repository: MainCommentsRepository,
    @Inject(QueryCommentsRepository) private readonly queryRepository: QueryCommentsRepository,
  ) {}

  private async validate(id: number, userId: number, body: ChangeCommentByIdDto) {
    try {
      await validateOrReject(body);
    } catch (e) {
      throw new BadRequestException(e);
    }

    const comment = await this.queryRepository.getCommentById(id).catch((e) => {
      this.logger.error(`Error in getting a comment - ${id}. ${JSON.stringify(e)}`);
      throw new NotFoundException();
    });
    if (!comment) {
      throw new NotFoundException();
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException();
    }
  }

  public async execute(id: number, body: ChangeCommentByIdDto, userId: number): Promise<void> {
    await this.validate(id, userId, body);

    await this.repository.changeCommentById(id, body).catch(() => {
      this.logger.error(`Error when updating a comment - ${id}`);
    });
  }
}
