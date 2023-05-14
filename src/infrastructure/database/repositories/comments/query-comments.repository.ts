import { Injectable } from '@nestjs/common';
import { CommentsEntity } from '../../../../domain/comments/entities/comment.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class QueryCommentsRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(CommentsEntity) private readonly repository: Repository<CommentsEntity>,
  ) {}

  async getCommentByPostId(
    postId: number,
    offset: number,
    limit: number,
    sortBy: string,
    direction: string,
  ): Promise<[CommentsEntity[], number]> {
    return this.repository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'user')
      .leftJoinAndSelect('c.post', 'post')
      .where('post.id = :postId', { postId })
      .orderBy(`c."${sortBy}"`, direction.toUpperCase() as 'ASC' | 'DESC')
      .limit(limit)
      .offset(offset)
      .getManyAndCount();
  }

  async getCommentById(id: number): Promise<CommentsEntity> {
    return this.repository.findOne({ where: { id }, relations: ['user'] });
  }
  async getCommentForAllBlogs(
    blogIds: number[],
    skip: number,
    limit: number,
    sortBy: string,
    sortDir: string,
  ): Promise<[CommentsEntity[], number]> {
    return this.repository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'user')
      .leftJoinAndSelect('c.post', 'post')
      .leftJoinAndSelect('c.blog', 'blog')
      .where('blog.id IN(:...blogIds)', { blogIds })
      .orderBy(`c."${sortBy}"`, sortDir.toUpperCase() as 'ASC' | 'DESC')
      .getManyAndCount();
  }
}
