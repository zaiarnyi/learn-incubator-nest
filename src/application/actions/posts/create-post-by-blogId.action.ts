import { Inject, Injectable } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';

@Injectable()
export class CreatePostByBlogIdAction {
  constructor() {}

  async execute(id: string, dto: any) {
    // console.log(this.queryBlogRepository.getBlogById(id));
  }
}
