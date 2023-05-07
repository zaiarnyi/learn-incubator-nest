import { CreatePostDto } from '../../../domain/posts/dto/create-post.dto';
import { ForbiddenException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { Post, PostEntity } from '../../../domain/posts/entities/post.entity';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';
import { plainToClass } from 'class-transformer';
import { GetPost } from '../../../presentation/responses/posts/get-all-posts.response';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { MainLikeStatusPostRepository } from '../../../infrastructure/database/repositories/posts/like-status/main-like-status-post.repository';
import { LikeStatusPosts } from '../../../domain/posts/like-status/entity/like-status-posts.entity';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { BlogEntity } from '../../../domain/blogs/entities/blog.entity';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';

export class CreatePostAction {
  logger = new Logger(CreatePostAction.name);

  constructor(
    @Inject(QueryBlogsRepository)
    private readonly queryBlogRepository: QueryBlogsRepository,

    @Inject(MainPostRepository)
    private readonly mainRepository: MainPostRepository,
    @Inject(MainLikeStatusPostRepository) private readonly statusMainRepository: MainLikeStatusPostRepository,
    @Inject(UserQueryRepository) private readonly userQueryRepository: UserQueryRepository,
  ) {}

  private getLikesInfo() {
    return {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatusEnum.None,
      newestLikes: [],
    };
  }

  private async validate(blogId: number, userId: number) {
    const blog = await this.queryBlogRepository.getBlogsByBloggerWithUser(blogId).catch((e) => {
      this.logger.error(`Error when getting a post by blog id ${blogId}. ${JSON.stringify(e)}`);
    });

    if (!blog) {
      throw new NotFoundException();
    }
    if (blog.user !== userId || blog.is_banned) {
      throw new ForbiddenException();
    }
    return blog;
  }
  public async execute(payload: CreatePostDto, userId?: number): Promise<GetPost | any> {
    const blog = await this.validate(payload.blogId, userId);
    const newPost = new PostEntity();

    newPost.title = payload.title;
    newPost.content = payload.content;
    newPost.short_description = payload.shortDescription;
    newPost.blog = blog.id;
    newPost.user = blog.user as number;

    const createdPost = await this.mainRepository.createPost(newPost);
    return {
      ...plainToClass(GetPost, {
        id: createdPost.id.toString(),
        title: createdPost.title,
        shortDescription: createdPost.short_description,
        content: createdPost.content,
        createdAt: createdPost.createdAt,
        blogId: blog.id.toString(),
        blogName: blog.name,
      }),
      extendedLikesInfo: this.getLikesInfo(),
    };
  }
}
