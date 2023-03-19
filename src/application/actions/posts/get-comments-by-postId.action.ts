import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetCommentsByPostIdDto } from '../../../domain/posts/dto/get-comments-by-postId.dto';
import { QueryCommentsRepository } from '../../../infrastructure/database/repositories/comments/query-comments.repository';
import {
  GetCommentsByPostIdResponse,
  PostCommentInfo,
} from '../../../presentation/responses/posts/get-comments-by-postId.response';
import { plainToClass } from 'class-transformer';
import { StatusCommentEnum } from '../../../domain/posts/enums/status-comment.enum';

@Injectable()
export class GetCommentsByPostIdAction {
  private logger = new Logger(GetCommentsByPostIdAction.name);
  constructor(@Inject(QueryCommentsRepository) private readonly queryRepository: QueryCommentsRepository) {}

  private getLikesInfo() {
    return {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: StatusCommentEnum.None,
    };
  }

  public async execute(postId: string, query: GetCommentsByPostIdDto): Promise<GetCommentsByPostIdResponse> {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const totalCount = await this.queryRepository.getCountComments();
    const skip = (pageNumber - 1) * pageSize;
    const pagesCount = Math.ceil(totalCount / pageSize);

    const commentsRaw = await this.queryRepository.getCommentByPostId(postId, skip, pageSize, sortBy, sortDirection);

    const comments = commentsRaw.map((item) => {
      return plainToClass(PostCommentInfo, {
        ...item,
        commentatorInfo: {
          userId: item.userId,
          userLogin: item.userLogin,
        },
        likesInfo: this.getLikesInfo(),
      });
    });

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: comments,
    };
  }
}
