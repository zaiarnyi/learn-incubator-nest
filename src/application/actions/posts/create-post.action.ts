import { CreatePostDto } from '../../../domain/posts/dto/create-post.dto';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { Post } from '../../../domain/posts/entities/post.entity';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';
import { plainToClass } from 'class-transformer';
import { GetPost } from '../../../presentation/responses/posts/get-all-posts.response';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { StatusCommentEnum } from '../../../domain/posts/enums/status-comment.enum';

export class CreatePostAction {
  logger = new Logger(CreatePostAction.name);

  constructor(
    @Inject(QueryPostRepository)
    private readonly queryPostRepository: QueryPostRepository,

    @Inject(MainPostRepository)
    private readonly mainRepository: MainPostRepository,
  ) {}

  private async getBlogById(id: string) {
    return this.queryPostRepository
      .getPostByBlogId(id)
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
      myStatus: StatusCommentEnum.None,
      newestLikes: [],
    };
  }

  private async validate(blogId: string) {
    const blog = await this.getBlogById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }
  public async execute(payload: CreatePostDto): Promise<GetPost> {
    const blog = await this.validate(payload.blogId);
    const newPost = new Post();
    newPost.blogName = blog.name;
    newPost.blogId = payload.blogId;
    newPost.content = payload.content;
    newPost.title = payload.title;
    newPost.shortDescription = payload.shortDescription;
    const createdPost = await this.mainRepository.createPost(newPost);

    return {
      ...plainToClass(GetPost, {
        ...createdPost.toObject(),
        id: createdPost._id.toString(),
      }),
      extendedLikesInfo: this.getLikesInfo(),
    };
  }
}
