import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PostCommentInfo } from '../../../presentation/responses/posts/get-comments-by-postId.response';
import { CreateCommentForPostDto } from '../../../domain/posts/dto/create-comment-for-post.dto';
import { MainCommentsRepository } from '../../../infrastructure/database/repositories/comments/main-comments.repository';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { validateOrReject } from 'class-validator';
import { CommentsEntity } from '../../../domain/comments/entities/comment.entity';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { plainToClass } from 'class-transformer';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { MainLikeStatusRepository } from '../../../infrastructure/database/repositories/comments/like-status/main-like-status.repository';
import { PostEntity } from '../../../domain/posts/entities/post.entity';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { QueryUserBannedRepository } from '../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';

@Injectable()
export class CreateCommentForPostAction {
  private logger = new Logger(CreateCommentForPostAction.name);

  constructor(
    @Inject(MainCommentsRepository) private readonly commentMainRepository: MainCommentsRepository,
    @Inject(QueryPostRepository) private readonly queryPostRepository: QueryPostRepository,
    @Inject(UserQueryRepository) private readonly queryUserRepository: UserQueryRepository,
    @Inject(MainLikeStatusRepository) private readonly mainLikeStatusCommentRepository: MainLikeStatusRepository,
    @Inject(QueryBlogsRepository) private readonly queryBlogsRepository: QueryBlogsRepository,
    @Inject(QueryUserBannedRepository) private readonly queryUserBannedRepository: QueryUserBannedRepository,
  ) {}

  private async getPost(postId: number, body: CreateCommentForPostDto, userId: number): Promise<PostEntity> {
    try {
      await validateOrReject(body);
    } catch (e) {
      throw new BadRequestException(e);
    }

    const post = await this.queryPostRepository.getPostById(postId).catch((e) => {
      this.logger.error(`Error when checking for the presence of a post - ${postId}. ${JSON.stringify(e)}`);
    });
    if (!post) {
      throw new NotFoundException();
    }

    const blog = await this.queryBlogsRepository.getBlogById(post.blog as number);
    if (blog.is_banned) {
      throw new ForbiddenException();
    }

    const userIsBanned = await this.queryUserBannedRepository.checkStatusByUserBlog(userId, post.blog as number);
    if (userIsBanned) {
      throw new ForbiddenException();
    }

    return post;
  }

  public async execute(postId: number, body: CreateCommentForPostDto, userId: number): Promise<PostCommentInfo> {
    const post = await this.getPost(postId, body, userId);

    const user = await this.queryUserRepository.getUserById(userId).catch((e) => {
      this.logger.error(`Error when getting a user to create a comment - ${userId}. ${JSON.stringify(e)}`);
    });
    if (!user) {
      throw new NotFoundException();
    }

    const comment = new CommentsEntity();
    comment.post = post.id;
    comment.user = user.id;
    comment.blog = post.blog;
    comment.content = body.content;

    const createdComment = await this.commentMainRepository.createComment(comment);
    const commentId = createdComment.id.toString();

    return plainToClass(PostCommentInfo, {
      ...createdComment,
      id: commentId,
      commentatorInfo: {
        userId: createdComment.user,
        userLogin: user.login,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusEnum.None,
      },
    });
  }
}
