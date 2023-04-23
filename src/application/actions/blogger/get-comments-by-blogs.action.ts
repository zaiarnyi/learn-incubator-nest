import { Inject, Injectable } from '@nestjs/common';
import { GetCommentsByBlogResponse } from '../../../presentation/responses/blogger/get-comments-by-blog.response';
import { GetPostByBlogIdDto } from '../../../domain/blogs/dto/getPostByBlogId.dto';
import { QueryCommentsRepository } from '../../../infrastructure/database/repositories/comments/query-comments.repository';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { plainToClass } from 'class-transformer';
import { QueryPostRepository } from '../../../infrastructure/database/repositories/posts/query-post.repository';

@Injectable()
export class GetCommentsByBlogsAction {
  constructor(
    @Inject(QueryCommentsRepository) private readonly commentMainRepository: QueryCommentsRepository,
    @Inject(QueryBlogsRepository)
    private readonly queryRepository: QueryBlogsRepository,
    @Inject(QueryPostRepository) private readonly queryPostRepository: QueryPostRepository,
  ) {}

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
        commentatorInfo: {
          userId: item.userId,
          userLogin: item.userLogin,
        },
        createdAt: item.createdAt,
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
