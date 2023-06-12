import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { AuthBotLinkResponse } from '../../../presentation/responses/integrations/auth-bot-link.response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthBotLinkAction {
  constructor(private readonly configService: ConfigService) {}

  public execute(user: UserEntity): AuthBotLinkResponse {
    let params = 'code';
    if (this.configService.get('NODE_ENV') === 'development') {
      params = 'start';
    }
    return { link: 'https://t.me/incubator_study_blBBot' + `?${params}=${user.uuid}` };
  }
}
