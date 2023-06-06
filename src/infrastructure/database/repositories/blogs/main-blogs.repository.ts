import { CreateBlogDto } from '../../../../domain/blogs/dto/create-blog.dto';
import { BlogEntity } from '../../../../domain/blogs/entities/blog.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../../domain/users/entities/user.entity';
import { BlogImagesEntity } from '../../../../domain/blogs/entities/blog-images.entity';
import { BlogImagesTypeEnum } from '../../../../domain/blogs/enums/blog-images-type.enum';

@Injectable()
export class MainBlogsRepository {
  constructor(
    @InjectRepository(BlogEntity) private readonly repository: Repository<BlogEntity>,
    @InjectRepository(BlogImagesEntity) private readonly blogImagesEntityRepository: Repository<BlogImagesEntity>,
  ) {}
  async createBlog(blog: BlogEntity): Promise<BlogEntity> {
    return this.repository.save(blog);
  }

  async updateBlog(id: number, userId: number, blog: CreateBlogDto) {
    return this.repository.update({ id, user: { id: userId } }, blog);
  }

  async deleteBlogById(id: number) {
    return this.repository.delete({ id });
  }

  async bindUserToBlog(id: number, user: UserEntity): Promise<any> {
    return this.repository.update({ id }, { user });
  }

  async changeBannedStatus(userId: number, isBanned: boolean): Promise<any> {
    return this.repository.update({ user: { id: userId } }, { isBanned });
  }

  async changeBannedStatusByBlogger(userId: number, blogId: number, isBanned: boolean): Promise<any> {
    return this.repository.update({ user: { id: userId }, id: blogId }, { isBanned });
  }

  async changeBannedStatusByBlogId(blogId: number, isBanned: boolean): Promise<any> {
    const banDate = isBanned ? new Date().toISOString() : null;
    return this.repository.update({ id: blogId }, { isBanned, banDate });
  }

  async deleteImageForBlog(id: number, type: BlogImagesTypeEnum): Promise<void> {
    await this.blogImagesEntityRepository.delete({ id, type });
  }

  async saveImageForBlog(blog: BlogImagesEntity): Promise<BlogImagesEntity> {
    return this.blogImagesEntityRepository.save(blog);
  }
}
