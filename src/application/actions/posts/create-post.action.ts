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

  private async createDefaultStatus(postId: string, userId: string | number) {
    if (!userId) return null;
    const user = await this.userQueryRepository.getUserById(userId as number).catch((e) => {
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
    statusPost.userId = userId as string;
    statusPost.login = user.login;
    return this.statusMainRepository.createDefaultStatusForPost(statusPost);
  }

  private async validate(blogId: number, userId: number) {
    console.log(blogId, userId);
    const post = await this.queryPostRepository.getPostByBlogId(blogId).catch((e) => {
      this.logger.error(`Error when getting a post by blog id ${blogId}. ${JSON.stringify(e)}`);
    });
    if (!post) {
      throw new NotFoundException();
    }

    const user = post.user as UserEntity;
    if (user.id !== userId || post.is_banned) {
      throw new ForbiddenException();
    }
    return post;
  }
  public async execute(payload: CreatePostDto, userId?: number): Promise<GetPost | any> {
    const post = await this.validate(payload.blogId, userId);
    // const newPost = new PostEntity();
    // const blog = post.blog as BlogEntity;
    // const user = post.user as UserEntity;
    //
    // newPost.title = payload.title;
    // newPost.content = payload.content;
    // newPost.short_description = payload.shortDescription;
    // newPost.blog = blog;
    // newPost.user = user.id;
    //
    // const createdPost = await this.mainRepository.createPost(newPost);
    // // await this.createDefaultStatus(createdPost.id, userId).catch((e) => {
    // //   this.logger.error(`Error in post status creation. ${JSON.stringify(e)}`);
    // // });
    //
    // return {
    //   ...plainToClass(GetPost, {
    //     id: createdPost.id.toString(),
    //     title: createdPost.title,
    //     shortDescription: createdPost.short_description,
    //     content: createdPost.content,
    //     createdAt: createdPost.createdAt,
    //     blogId: blog.id.toString(),
    //     blogName: blog.name,
    //   }),
    //   extendedLikesInfo: this.getLikesInfo(),
    // };
  }
}
