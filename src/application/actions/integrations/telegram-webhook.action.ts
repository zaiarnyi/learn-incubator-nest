import { Injectable } from '@nestjs/common';
import { UserMainRepository } from '../../../infrastructure/database/repositories/users/main.repository';

@Injectable()
export class TelegramWebhookAction {
  constructor(private readonly userRepository: UserMainRepository) {}
  public async execute(body: Record<string, any>) {
    console.log(body, 'body');
    try {
      if (!body.message.text.includes('/start')) return null;

      const uuid = body.message.text.split(' ')[1];

      await this.userRepository.setTelegramIdUsers(uuid, body.message.from.id);
    } catch (e) {}
  }
}
