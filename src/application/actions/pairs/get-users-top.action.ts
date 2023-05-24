import { Injectable } from '@nestjs/common';
import { GetUsersTopDto } from '../../../domain/pairs/dto/get-users-top.dto';
import { GetUsersTopResponse } from '../../../presentation/responses/pairs/get-users-top.response';

@Injectable()
export class GetUsersTopAction {
  public async execute(payload: GetUsersTopDto): Promise<GetUsersTopResponse | any> {}
}
