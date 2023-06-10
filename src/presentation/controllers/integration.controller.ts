import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('integration')
@ApiTags('integration')
export class IntegrationController {
  @Post('telegram/webhook')
  async webhookTelegram(@Body() body: any) {
    // {
    //   update_id: 223240812,
    //     channel_post: {
    //   message_id: 27,
    //     sender_chat: {
    //     id: -1001889989376,
    //       title: 'Papiloma',
    //       username: 'papiloma123',
    //       type: 'channel'
    //   },
    //   chat: {
    //     id: -1001889989376,
    //       title: 'Papiloma',
    //       username: 'papiloma123',
    //       type: 'channel'
    //   },
    //   date: 1686405057,
    //     text: '123'
    // }
    // }
    // console.log(body, 'bogy');
  }

  @Get('telegram/auth-bot-link')
  @ApiBearerAuth()
  async getAuthTelegramLink() {
    console.log(123123);
  }
}
