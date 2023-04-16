import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';
import { CreatePostDto } from '../../../domain/posts/dto/create-post.dto';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';

@Injectable()
export class UpdatePostByBlogAction {
  private logger = new Logger(UpdatePostByBlogAction.name);

  constructor(
    @Inject(QueryPostRepository)
    private readonly queryPostRepository: QueryPostRepository,
    @Inject(QueryBlogsRepository)
    private readonly queryBlogRepository: QueryBlogsRepository,
    @Inject(MainPostRepository) private readonly repository: MainPostRepository,
  ) {}

  private async validate(blogId: string, postId: string, userId?: string) {
    const [findPost, findBlog] = await Promise.all([
      this.queryPostRepository.getPostById(postId),
      this.queryBlogRepository.getBlogById(blogId),
    ]);

    if (!findPost) {
      throw new NotFoundException();
    }
    if (!userId) {
      throw new UnauthorizedException();
    }
    this.logger.warn(findPost, 'findPost');
    this.logger.warn(findBlog, 'findBlog');
    if ((findPost.userId && findPost.userId !== userId) || (findBlog.userId && findBlog.userId !== userId)) {
      throw new ForbiddenException();
    }
  }

  public async execute(body: CreatePostDto, postId: string, userId?: string) {
    await this.validate(body.blogId, postId, userId);

    await this.repository.updatePost(postId, body);
  }
}
