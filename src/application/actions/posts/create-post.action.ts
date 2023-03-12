import { CreatePostDto } from '../../../domain/posts/dto/create-post.dto';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { Post } from '../../../domain/posts/entities/post.entity';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';
import { plainToClass } from 'class-transformer';
import { GetPost } from '../../../presentation/responses/posts/get-all-posts.response';

export class CreatePostAction {
  logger = new Logger(CreatePostAction.name);

  constructor(
    @Inject(QueryBlogsRepository)
    private readonly queryBlogRepository: QueryBlogsRepository,
    @Inject(MainPostRepository)
    private readonly mainRepository: MainPostRepository,
  ) {}

  private async getBlogById(id: string) {
    return this.queryBlogRepository
      .getBlogById(id)
      .then((res) => {
        if (!res) {
          this.logger.warn(`Not found blog with ID: ${id}`);
          throw new NotFoundException('Not Found');
        }
        return res;
      })
      .catch(() => {
        this.logger.error(`Not found blog with ID: ${id}`);
        throw new NotFoundException('Not Found');
      });
  }

  private getLikesInfo() {
    return {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
  }
  public async execute(payload: CreatePostDto) {
    const blog = await this.getBlogById(payload.blogId);
    const newPost = new Post();
    newPost.blogName = blog.name;
    newPost.blogId = payload.blogId;
    newPost.content = payload.content;
    newPost.title = payload.title;
    newPost.shortDescription = payload.shortDescription;

    const createdPost = await this.mainRepository.createPost(newPost);
    return {
      ...plainToClass(GetPost, createdPost),
      extendedLikesInfo: this.getLikesInfo(),
    };
  }
}
