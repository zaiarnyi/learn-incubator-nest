import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';

@Injectable()
export class DeletePostAction {
  private logger = new Logger(DeletePostAction.name);

  constructor(@Inject(MainPostRepository) private readonly repository: MainPostRepository) {}

  public async execute(id: number): Promise<void> {
    await this.repository
      .deletePost(id)
      .then((result) => {
        if (!result) {
          this.logger.log(`The post with id - ${id} was not found`);
          throw new NotFoundException();
        }
        return result;
      })
      .catch((e) => {
        this.logger.error(`Error in removing the post by id: ${id}. ${JSON.stringify(e, null, 2)}`);
        throw new NotFoundException();
      });
  }
}
