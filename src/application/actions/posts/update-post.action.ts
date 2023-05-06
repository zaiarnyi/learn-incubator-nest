import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';
import { CreatePostDto } from '../../../domain/posts/dto/create-post.dto';
import { validateOrReject } from 'class-validator';

@Injectable()
export class UpdatePostAction {
  private logger = new Logger(UpdatePostAction.name);

  constructor(private readonly queryRepository: QueryPostRepository, private readonly repository: MainPostRepository) {}

  public async execute(id: number, payload: CreatePostDto): Promise<void> {
    await validateOrReject(payload);
    await Promise.all([
      this.queryRepository
        .getPostById(id)
        .then((result) => {
          if (!result) {
            this.logger.log(`The post with id - ${id} was not found`);
            throw new NotFoundException();
          }
          return result;
        })
        .catch((e) => {
          this.logger.error(`Error in getting the post by id: ${id}. ${JSON.stringify(e, null, 2)}`);
          throw new NotFoundException();
        }),
      this.queryRepository
        .getPostByBlogId(payload.blogId)
        .then((result) => {
          if (!result) {
            this.logger.log(`The blog with id - ${payload.blogId} was not found`);
            throw new NotFoundException();
          }
          return result;
        })
        .catch((e) => {
          this.logger.error(`Error in getting the post by id: ${id}. ${JSON.stringify(e, null, 2)}`);
          throw new NotFoundException();
        }),
    ]);
    await this.repository.updatePost(id, payload).catch((e) => {
      this.logger.error(`Error when updating the post by id: ${id}. ${JSON.stringify(e, null, 2)}`);
      throw new NotFoundException();
    });
  }
}
