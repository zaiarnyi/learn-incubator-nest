import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';

@Injectable()
export class DeletePostByBlogIdAction {
  private logger = new Logger(DeletePostByBlogIdAction.name);

  constructor(
    @Inject(QueryPostRepository)
    private readonly queryPostRepository: QueryPostRepository,
    @Inject(MainPostRepository) private readonly repository: MainPostRepository,
    @Inject(QueryBlogsRepository) private readonly queryBlogRepository: QueryBlogsRepository,
  ) {}

  private async validate(blogId: number, postId: number, userId: number) {
    const findPost = await this.queryPostRepository.getPostById(postId, ['blog', 'user']);
    if (!findPost) {
      throw new NotFoundException();
    }
    if (findPost.user.id !== userId || findPost.blog.id !== blogId) {
      throw new ForbiddenException();
    }
  }

  public async execute(blogId: number, postId: number, userId: number) {
    await this.validate(blogId, postId, userId);

    await this.repository.deletePost(postId);
  }
}
