import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';

@Injectable()
export class DeletePostByBlogIdAction {
  private logger = new Logger(DeletePostByBlogIdAction.name);

  constructor(
    @Inject(QueryPostRepository)
    private readonly queryPostRepository: QueryPostRepository,
    @Inject(MainPostRepository) private readonly repository: MainPostRepository,
  ) {}

  private async validate(blogId: string, postId: string, userId: string) {
    const findPost = await this.queryPostRepository.getAllPostById(postId);
    if (!findPost) {
      throw new NotFoundException();
    }

    if (findPost.userId !== userId || findPost.blogId !== blogId) {
      throw new ForbiddenException();
    }
  }

  public async execute(blogId: number, postId: string, userId: string) {
    await this.validate(blogId, postId, userId);

    await this.repository.deletePost(postId);
  }
}
