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

@Injectable()
export class GetCommentsByBlogsAction {
  constructor(
    @Inject(QueryCommentsRepository) private readonly commentMainRepository: QueryCommentsRepository,
    @Inject(QueryBlogsRepository)
    private readonly queryRepository: QueryBlogsRepository,
    @Inject(QueryPostRepository) private readonly queryPostRepository: QueryPostRepository,
    @Inject(QueryLikeStatusRepository) private readonly queryLikeStatusRepository: QueryLikeStatusRepository,
  ) {}

  private async getLikesInfo(commentId: string): Promise<ExtendedLikesInfo> {
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

  public async execute(query: GetPostByBlogIdDto, userId: string): Promise<GetCommentsByBlogResponse | any> {
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

    const promises = comments.map(async (item) => {
      const post = await this.queryPostRepository.getPostById(item.postId);
      return {
        id: item._id.toString(),
        content: item.content,
        createdAt: item.createdAt,
        commentatorInfo: {
          userId: item.userId,
          userLogin: item.userLogin,
        },
        likesInfo: await this.getLikesInfo(item._id.toString()),
        postInfo: {
          id: item.postId,
          title: post.title,
          blogId: post.blogId,
          blogName: post.blogName,
        },
      };
    });

    return plainToClass(GetCommentsByBlogResponse, {
      pagesCount,
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: await Promise.all(promises),
    });
  }
}
