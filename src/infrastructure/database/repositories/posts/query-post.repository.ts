import { Injectable } from '@nestjs/common';
import { PostEntity } from '../../../../domain/posts/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostImagesEntity } from '../../../../domain/posts/entities/post-images.entity';

@Injectable()
export class QueryPostRepository {
  constructor(
    @InjectRepository(PostEntity) private readonly repository: Repository<PostEntity>,
    @InjectRepository(PostImagesEntity) private readonly postImageRepository: Repository<PostImagesEntity>,
  ) {}

  async getPost(
    limit: number,
    offset: number,
    sortBy: string,
    direction: string,
    subscription: number[],
  ): Promise<[PostEntity[], number]> {
    const sort = sortBy === 'blogName' ? 'name' : sortBy;
    const query = this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.blog', 'blog')
      .where('p."isBanned" = false');

    if (subscription && subscription.length) {
      query.andWhere('blog.id in (:...ids)', { ids: subscription });
    }

    if (sort === 'name') {
      query.orderBy(`blog.name`, direction.toUpperCase() as 'ASC' | 'DESC');
    } else {
      query.orderBy(`p."${sortBy}"`, direction.toUpperCase() as 'ASC' | 'DESC');
    }
    return query.limit(limit).offset(offset).getManyAndCount();
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

  async getPostImages(id: number): Promise<PostImagesEntity[]> {
    return this.postImageRepository.find({ where: { post: { id } }, relations: ['post'] });
  }
}
