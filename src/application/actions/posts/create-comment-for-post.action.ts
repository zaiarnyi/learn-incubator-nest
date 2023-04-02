import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PostCommentInfo } from '../../../presentation/responses/posts/get-comments-by-postId.response';
import { CreateCommentForPostDto } from '../../../domain/posts/dto/create-comment-for-post.dto';
import { MainCommentsRepository } from '../../../infrastructure/database/repositories/comments/main-comments.repository';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { validateOrReject } from 'class-validator';
import { Comment } from '../../../domain/comments/entities/comment.entity';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { plainToClass } from 'class-transformer';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { LikeStatusComment } from '../../../domain/comments/like-status/entity/like-status-comments.entity';
import { MainLikeStatusRepository } from '../../../infrastructure/database/repositories/comments/like-status/main-like-status.repository';

@Injectable()
export class CreateCommentForPostAction {
  private logger = new Logger(CreateCommentForPostAction.name);

  constructor(
    @Inject(MainCommentsRepository) private readonly commentMainRepository: MainCommentsRepository,
    @Inject(QueryPostRepository) private readonly queryPostRepository: QueryPostRepository,
    @Inject(UserQueryRepository) private readonly queryUserRepository: UserQueryRepository,
    @Inject(MainLikeStatusRepository) private readonly mainLikeStatusCommentRepository: MainLikeStatusRepository,
  ) {}

  private async createLikeStatusForComment(commentId: string, userId: string) {
    const status = new LikeStatusComment();
    status.myStatus = LikeStatusEnum.None;
    status.commentId = commentId;
    status.like = false;
    status.dislike = false;
    status.userId = userId;
    return this.mainLikeStatusCommentRepository.createLikeStatusForComment(status);
  }

  private async validate(postId: string, body: CreateCommentForPostDto) {
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
  }

  public async execute(postId: string, body: CreateCommentForPostDto, userId: string): Promise<PostCommentInfo | any> {
    await this.validate(postId, body);

    const user = await this.queryUserRepository.getUserById(userId).catch((e) => {
      this.logger.error(`Error when getting a user to create a comment - ${userId}. ${JSON.stringify(e)}`);
    });
    if (!user) {
      throw new NotFoundException();
    }

    const comment = new Comment();
    comment.postId = postId;
    comment.userId = userId;
    comment.content = body.content;
    comment.userLogin = user.login;

    const createdComment = await this.commentMainRepository.createComment(comment);
    const commentId = createdComment._id.toString();
    await this.createLikeStatusForComment(commentId, userId).catch((e) => {
      this.logger.error(`Error creating likes statuses for comments. ${commentId} / ${userId}. ${JSON.stringify(e)}`);
    });
    return plainToClass(PostCommentInfo, {
      ...createdComment.toObject(),
      id: commentId,
      commentatorInfo: {
        userId: createdComment.userId,
        userLogin: createdComment.userLogin,
      },
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusEnum.None,
      },
    });
  }
}
