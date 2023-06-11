import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthBotLinkAction } from '../../application/actions/integrations/auth-bot-link.action';
import { TelegramWebhookAction } from '../../application/actions/integrations/telegram-webhook.action';
import { JwtAuthGuard } from '../../domain/auth/guards/jwt-auth.guard';
import { AuthBotLinkResponse } from '../responses/integrations/auth-bot-link.response';

@Controller('integrations')
@ApiTags('integrations')
export class IntegrationController {
  constructor(
    private readonly authBotAction: AuthBotLinkAction,
    private readonly telegramWebhook: TelegramWebhookAction,
  ) {}
  @Post('telegram/webhook')
  @ApiOperation({ summary: `Webhook for TelegramBot Api (see telegram bot official documentation)` })
  async webhookTelegram(@Body() body: Record<string, any>) {
    await this.telegramWebhook.execute(body);
  }

  @Get('telegram/auth-bot-link')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse({ type: AuthBotLinkResponse })
  @ApiOperation({ summary: `Get auth bot link with personal user code inside` })
  async getAuthTelegramLink(@Req() req: any): Promise<AuthBotLinkResponse> {
    return this.authBotAction.execute(req.user);
  }
}
