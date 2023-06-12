import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { AuthBotLinkResponse } from '../../../presentation/responses/integrations/auth-bot-link.response';

@Injectable()
export class AuthBotLinkAction {
  public execute(user: UserEntity): AuthBotLinkResponse {
    return { link: 'https://t.me/incubator_study_blBBot' + `?code=${user.uuid}` };
  }
}
