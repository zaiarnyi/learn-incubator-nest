import { Injectable, Post } from '@nestjs/common';
import { PostEntity } from '../../../../domain/posts/entities/post.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class QueryPostRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(PostEntity) private readonly repository: Repository<PostEntity>,
  ) {}

  async getPost(limit: number, offset: number, sortBy: string, direction: string): Promise<[PostEntity[], number]> {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'blog')
      .where('p."isBanned" = false')
      .orderBy(`p."${sortBy}"`, direction.toUpperCase() as 'ASC' | 'DESC')
      .limit(limit)
      .offset(offset)
      .getManyAndCount();
  }
  async getPostByBlogId(id: number): Promise<PostEntity> {
    return this.repository.findOne({
      where: { blog: { id } },
      relations: ['blog'],
    });
  }

  async getPostById(id: number, relations?: string[]): Promise<PostEntity> {
    return this.repository.findOne({ where: { id, isBanned: false }, relations });
  }
  async getManyPostsByBlogId(
    id: number,
    skip: number,
    limit: number,
    sortBy: string,
    direction: string,
  ): Promise<[PostEntity[], number]> {
    return this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'blog', `blog.id = ${id}`)
      .where('p."isBanned" = false')
      .orderBy(`p."${sortBy}"`, direction.toUpperCase() as 'ASC' | 'DESC')
      .offset(skip)
      .limit(limit)
      .getManyAndCount();
  }
}
