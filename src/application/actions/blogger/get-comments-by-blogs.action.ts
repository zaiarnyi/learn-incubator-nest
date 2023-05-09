import { Inject, Injectable } from '@nestjs/common';
import { GetCommentsByBlogResponse } from '../../../presentation/responses/blogger/get-comments-by-blog.response';
import { GetPostByBlogIdDto } from '../../../domain/blogs/dto/getPostByBlogId.dto';
import { QueryCommentsRepository } from '../../../infrastructure/database/repositories/comments/query-comments.repository';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { plainToClass } from 'class-transformer';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';
import { ExtendedLikesInfo } from '../../../presentation/responses/extendedLikesInfo.response';
import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { QueryLikeStatusRepository } from '../../../infrastructure/database/repositories/comments/like-status/query-like-status.repository';
import { PostLikesEntity } from '../../../domain/posts/like-status/entity/like-status-posts.entity';
import { CommentLikesEntity } from '../../../domain/comments/like-status/entity/like-status-comments.entity';
import { CommentsEntity } from '../../../domain/comments/entities/comment.entity';

@Injectable()
export class GetCommentsByBlogsAction {
  constructor(
    @Inject(QueryCommentsRepository) private readonly commentMainRepository: QueryCommentsRepository,
    @Inject(QueryBlogsRepository)
    private readonly queryRepository: QueryBlogsRepository,
    @Inject(QueryPostRepository) private readonly queryPostRepository: QueryPostRepository,
    @Inject(QueryLikeStatusRepository) private readonly queryLikeStatusRepository: QueryLikeStatusRepository,
  ) {}

  private async getLikesInfo(commentId: number): Promise<ExtendedLikesInfo> {
    const [likesCount, dislikesCount] = await Promise.all([
      this.queryLikeStatusRepository.getCountLikesByCommentId(commentId, 'like'),
      this.queryLikeStatusRepository.getCountLikesByCommentId(commentId, 'dislike'),
    ]);
    return plainToClass(ExtendedLikesInfo, {
      likesCount,
      dislikesCount,
      myStatus: LikeStatusEnum.None,
    });
  }

  public async execute(query: GetPostByBlogIdDto, userId: number): Promise<GetCommentsByBlogResponse | any> {
    const blogIds = await this.queryRepository.getBlogsByBlogger(userId);

    const totalCount = await this.commentMainRepository.getCountCommentsForAllBlogs(blogIds);
    const skip = (query.pageNumber - 1) * query.pageSize;
    const pagesCount = Math.ceil(totalCount / query.pageSize);

    const comments = await this.commentMainRepository.getCommentForAllBlogs(
      blogIds,
      skip,
      query.pageSize,
      query.sortBy,
      query.sortDirection,
    );

    const promises = comments.map(
      async (
        item: CommentsEntity & {
          login: string;
          commentId: number;
          title: string;
          name: string;
          commentContent: string;
          commentCreatedAt: Date;
        },
      ) => {
        return {
          id: item.commentId.toString(),
          content: item.commentContent,
          createdAt: item.commentCreatedAt,
          commentatorInfo: {
            userId: item.user.toString(),
            userLogin: item.login,
          },
          likesInfo: await this.getLikesInfo(item.id),
          postInfo: {
            id: item.post.toString(),
            title: item.title,
            blogId: item.blog.toString(),
            blogName: item.name,
          },
        };
      },
    );

    return plainToClass(GetCommentsByBlogResponse, {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: await Promise.all(promises),
    });
  }
}
