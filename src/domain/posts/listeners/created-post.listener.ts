import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreatedPostEvent } from '../events/created-post.event';
import { QueryBlogsRepository } from '../../../infrastructure/database/repositories/blogs/query-blogs.repository';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CreatedPostListener {
  private readonly logger = new Logger(CreatedPostListener.name);
  constructor(private readonly queryBlogRepository: QueryBlogsRepository, private readonly httpService: HttpService) {}

  private async sendMessage(telegramId: number, message: string): Promise<void> {
    console.log(telegramId, message);
    const link = `https://api.telegram.org/bot6203822227:AAFW725L9J4S55TfW0_kxc3RSKeyJawY3ow/sendMessage`;

    const response = await firstValueFrom(this.httpService.post(link, { chat_id: telegramId, text: message }));
    this.logger.log(`The message was sent to telegram with the status: ${response.status}`);
  }
  @OnEvent(CreatedPostEvent.name, { async: true })
  async handleOrderCreatedEvent(event: CreatedPostEvent) {
    const message = `New post published for blog "${event.blog.name}`;

    const subscriptions = await this.queryBlogRepository.subscriptionForBlog(event.blog.id);
    console.log(subscriptions, 'subscriptions');
    for (const subscription of subscriptions) {
      if (!subscription.user.telegramId) continue;
      await this.sendMessage(subscription.user.telegramId, message).catch((e) => {
        this.logger.error(`Error for send message to telegram. Message: ${e.message}`);
      });
    }
  }
}
