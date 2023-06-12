import { Injectable, Logger } from '@nestjs/common';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';

@Injectable()
export class TelegramWebhookAction {
  private readonly logger = new Logger(TelegramWebhookAction.name);
  constructor(private readonly userRepository: UserMainRepository) {}
  public async execute(body: Record<string, any>) {
    try {
      if (!body?.message?.text?.includes('/start')) return null;

      const uuid = body.message.text.split(' ')[1].replace(/code=/, '');
      await this.userRepository.setTelegramIdUsers(uuid, body?.message?.from?.id ?? body?.message?.chat?.id);
    } catch (e) {
      this.logger.error(`Error telegram webhook. Message: ${e.message}`);
    }
  }
}
