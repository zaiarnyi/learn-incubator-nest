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

  private async validate(blogId: number, postId: number, userId?: number) {
    const [findPost, findBlog] = await Promise.all([
      this.queryPostRepository.getPostById(postId, ['user']),
      this.queryBlogRepository.getBlogById(blogId),
    ]);

    if (!findPost) {
      throw new NotFoundException();
    }
    if (!userId) {
      throw new UnauthorizedException();
    }
    if ((findPost.user && findPost.user.id !== userId) || (findBlog.user && findBlog.user.id !== userId)) {
      throw new ForbiddenException();
    }
  }

  public async execute(body: CreatePostDto, postId: number, userId?: number) {
    await this.validate(body.blogId, postId, userId);

    await this.repository.updatePost(postId, {
      title: body.title,
      content: body.content,
      shortDescription: body.shortDescription,
    });
  }
}
