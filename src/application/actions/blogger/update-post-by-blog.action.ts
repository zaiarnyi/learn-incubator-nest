import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';
import { CreatePostDto } from '../../../domain/posts/dto/create-post.dto';

@Injectable()
export class UpdatePostByBlogAction {
  private logger = new Logger(UpdatePostByBlogAction.name);

  constructor(
    @Inject(QueryPostRepository)
    private readonly queryPostRepository: QueryPostRepository,
    @Inject(MainPostRepository) private readonly repository: MainPostRepository,
  ) {}

  private async validate(blogId: string, postId: string, userId: string) {
    const findPost = await this.queryPostRepository.getPostById(postId);

    if (!findPost) {
      throw new NotFoundException();
    }

    if (findPost.userId !== userId || findPost.blogId !== blogId) {
      throw new ForbiddenException();
    }
  }

  public async execute(body: CreatePostDto, postId: string, userId: string) {
    await this.validate(body.blogId, postId, userId);

    await this.repository.updatePost(postId, body);
  }
}
