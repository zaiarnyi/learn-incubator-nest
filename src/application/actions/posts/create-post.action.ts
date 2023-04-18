import { CreatePostDto } from '../../../domain/posts/dto/create-post.dto';
import { ForbiddenException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { Post } from '../../../domain/posts/entities/post.entity';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';
import { plainToClass } from 'class-transformer';
import { GetPost } from '../../../presentation/responses/posts/get-all-posts.response';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { MainLikeStatusPostRepository } from '../../../infrastructure/database/repositories/posts/like-status/main-like-status-post.repository';
import { LikeStatusPosts } from '../../../domain/posts/like-status/entity/like-status-posts.entity';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';

export class CreatePostAction {
  logger = new Logger(CreatePostAction.name);

  constructor(
    @Inject(QueryPostRepository)
    private readonly queryPostRepository: QueryPostRepository,

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

  private async createDefaultStatus(postId: string, userId: string) {
    if (!userId) return null;
    const user = await this.userQueryRepository.getUserById(userId).catch((e) => {
      this.logger.error(
        `Error when getting a user to create a status for a post with id ${postId}. ${JSON.stringify(e)}`,
      );
    });
    if (!user) return null;
    const statusPost = new LikeStatusPosts();
    statusPost.postId = postId;
    statusPost.like = false;
    statusPost.dislike = false;
    statusPost.myStatus = LikeStatusEnum.None;
    statusPost.userId = userId;
    statusPost.login = user.login;
    return this.statusMainRepository.createDefaultStatusForPost(statusPost);
  }

  private async validate(blogId: string, userId: string) {
    return this.queryPostRepository.getPostByBlogId(blogId).then((res) => {
      if (!res?.userId || res?.userId !== userId) {
        throw new ForbiddenException();
      }
      if (!res) {
        // this.logger.warn(`Not found blog with ID: ${blogId}`);
        throw new NotFoundException();
      }
      return res;
    });
  }
  public async execute(payload: CreatePostDto, userId?: string): Promise<GetPost> {
    const blog = await this.validate(payload.blogId, userId);
    const newPost = new Post();
    newPost.blogName = blog.name;
    newPost.blogId = payload.blogId;
    newPost.content = payload.content;
    newPost.title = payload.title;
    newPost.shortDescription = payload.shortDescription;
    newPost.userId = userId;

    const createdPost = await this.mainRepository.createPost(newPost);
    await this.createDefaultStatus(createdPost._id.toString(), userId).catch((e) => {
      this.logger.error(`Error in post status creation. ${JSON.stringify(e)}`);
    });

    return {
      ...plainToClass(GetPost, {
        ...createdPost.toObject(),
        id: createdPost._id.toString(),
      }),
      extendedLikesInfo: this.getLikesInfo(),
    };
  }
}
