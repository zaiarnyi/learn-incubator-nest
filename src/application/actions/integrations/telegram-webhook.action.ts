import { Injectable, Logger } from '@nestjs/common';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';

@Injectable()
export class TelegramWebhookAction {
  private readonly logger = new Logger(TelegramWebhookAction.name);
  constructor(private readonly userRepository: UserMainRepository) {}
  public async execute(body: Record<string, any>) {
    console.log(body, 'body');
    try {
      if (!body.message.text.includes('/start')) return null;

      const uuid = body.message.text.split(' ')[1].replace(/code=/, '');
      console.log(uuid, 'uuid');
      const update = await this.userRepository.setTelegramIdUsers(
        uuid,
        body?.message?.from?.id ?? body?.message?.chat?.id,
      );
      console.log(update, 'update');
    } catch (e) {
      this.logger.error(`Error telegram webhook. Message: ${e.message}`);
    }
  }
}
