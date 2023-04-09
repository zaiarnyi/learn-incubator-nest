import { ForbiddenException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { MainCommentsRepository } from '../../../infrastructure/database/repositories/comments/main-comments.repository';
import { QueryCommentsRepository } from '../../../infrastructure/database/repositories/comments/query-comments.repository';

export class DeleteCommentByIdAction {
  private logger = new Logger(DeleteCommentByIdAction.name);

  constructor(
    @Inject(MainCommentsRepository) private readonly repository: MainCommentsRepository,
    @Inject(QueryCommentsRepository) private readonly queryRepository: QueryCommentsRepository,
  ) {}

  public async execute(id: string, userId: string): Promise<void> {
    const comment = await this.queryRepository.getCommentById(id).catch((e) => {
      this.logger.error(`Error in getting a comment - ${id}. ${JSON.stringify(e)}`);
      throw new NotFoundException();
    });
    this.logger.log(comment, 'comment');
    if (!comment) {
      throw new NotFoundException();
    }
    if (comment.userId !== userId) {
      throw new ForbiddenException();
    }

    await this.repository.removeCommentById(id).catch((e) => {
      this.logger.error(`Error when deleting a comment - ${id}. ${JSON.stringify(e)}`);
    });
  }
}
