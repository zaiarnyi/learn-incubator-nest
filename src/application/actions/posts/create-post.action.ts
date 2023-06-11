import { CreatePostDto } from '../../../domain/posts/dto/create-post.dto';
import { ForbiddenException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { PostEntity } from '../../../domain/posts/entities/post.entity';
import { MainPostRepository } from '../../../infrastructure/database/repositories/posts/main-post.repository';
import { plainToClass } from 'class-transformer';
import { GetPost } from '../../../presentation/responses/posts/get-all-posts.response';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreatedPostEvent } from '../../../domain/posts/events/created-post.event';

export class CreatePostAction {
  logger = new Logger(CreatePostAction.name);

  constructor(
    @Inject(QueryBlogsRepository) private readonly queryBlogRepository: QueryBlogsRepository,
    private eventEmitter: EventEmitter2,
    private readonly mainRepository: MainPostRepository,
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
    console.log(blog, userId);
    if (!blog) {
      throw new NotFoundException();
    }
    if (blog.user.id !== userId || blog.isBanned) {
      throw new ForbiddenException();
    }
    return blog;
  }
  public async execute(payload: CreatePostDto, user?: UserEntity): Promise<GetPost | any> {
    const blog = await this.validate(payload.blogId, user?.id);
    const newPost = new PostEntity();

    newPost.title = payload.title;
    newPost.content = payload.content;
    newPost.shortDescription = payload.shortDescription;
    newPost.blog = blog;
    newPost.user = user ?? blog.user;

    const createdPost = await this.mainRepository.createPost(newPost);
    this.eventEmitter.emit(CreatedPostEvent.name, new CreatedPostEvent(blog));

    return {
      ...plainToClass(GetPost, {
        ...createdPost,
        id: createdPost.id.toString(),
        blogId: blog.id.toString(),
        blogName: blog.name,
      }),
      extendedLikesInfo: this.getLikesInfo(),
      images: {
        main: [],
      },
    };
  }
}
