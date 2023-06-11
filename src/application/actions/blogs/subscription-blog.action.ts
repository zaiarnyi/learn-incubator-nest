import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { BlogEntity } from '../../../domain/blogs/entities/blog.entity';
import { SubscriptionUsersBlogsEntity } from '../../../domain/blogs/entities/subscription-users-blogs.entity';
import { SubscriptionStatusEnum } from '../../../domain/blogs/enums/subscription-status.enum';

@Injectable()
export class SubscriptionBlogAction {
  constructor(
    private readonly queryBlogRepository: QueryBlogsRepository,
    private readonly mainBlogRepository: MainBlogsRepository,
  ) {}

  private async checkSubscription(id: number): Promise<BlogEntity> {
    const blog = await this.queryBlogRepository.getBlogById(id);

    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }
  public async execute(blogId: number, user: UserEntity): Promise<void> {
    const blog = await this.checkSubscription(blogId);

    const findSubscription = await this.queryBlogRepository.getActiveSubscription(blogId, user.id);

    if (findSubscription) {
      findSubscription.status = SubscriptionStatusEnum.SUBSCRIPTION;
      await this.mainBlogRepository.updateSubscription(findSubscription);
      return;
    }

    const subscription = new SubscriptionUsersBlogsEntity();
    subscription.blog = blog;
    subscription.user = user;
    subscription.status = SubscriptionStatusEnum.SUBSCRIPTION;

    await this.mainBlogRepository.saveSubscriptions(subscription);
  }
}
