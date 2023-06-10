import { Module } from '@nestjs/common';
import { IntegrationController } from '../../presentation/controllers/integration.controller';
import { AuthBotLinkAction } from '../../application/actions/integrations/auth-bot-link.action';
import { TelegramWebhookAction } from '../../application/actions/integrations/telegram-webhook.action';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule],
  controllers: [IntegrationController],
  providers: [AuthBotLinkAction, TelegramWebhookAction],
})
export class IntegrationModule {}
