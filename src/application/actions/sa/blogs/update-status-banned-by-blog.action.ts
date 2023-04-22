import { Inject, Injectable } from '@nestjs/common';
import { MainBlogsRepository } from '../../../../infrastructure/database/repositories/blogs/main-blogs.repository';

@Injectable()
export class UpdateStatusBannedByBlogAction {
  constructor(@Inject(MainBlogsRepository) private readonly blogMainRepository: MainBlogsRepository) {}

  public async execute(blogId: string, isBanned: boolean) {
    await this.blogMainRepository.changeBannedStatusByBlogId(blogId, isBanned);
  }
}
