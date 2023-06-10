import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { MainBlogsRepository } from '../../../infrastructure/database/repositories/blogs/main-blogs.repository';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { SubscriptionUsersBlogsEntity } from '../../../domain/blogs/entities/subscription-users-blogs.entity';
import { SubscriptionStatusEnum } from '../../../domain/blogs/enums/subscription-status.enum';

@Injectable()
export class UnsubscriptionBlogAction {
  constructor(
    private readonly queryBlogRepository: QueryBlogsRepository,
    private readonly mainBlogRepository: MainBlogsRepository,
  ) {}

  private async checkSubscription(id: number, userId): Promise<SubscriptionUsersBlogsEntity> {
    const [blog, activeSubscription] = await Promise.all([
      this.queryBlogRepository.getBlogById(id),
      this.queryBlogRepository.getActiveSubscription(id, userId),
    ]);

    if (!blog || !activeSubscription) {
      throw new NotFoundException();
    }
    return activeSubscription;
  }
  public async execute(id: number, user: UserEntity): Promise<void> {
    const activeSubscription = await this.checkSubscription(id, user.id);

    activeSubscription.status = SubscriptionStatusEnum.UNSUBSCRIPTION;

    await this.mainBlogRepository.saveSubscriptions(activeSubscription);
  }
}
