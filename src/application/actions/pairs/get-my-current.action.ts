import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { GetCurrentPairResponse } from '../../../presentation/responses/pairs/get-current-pair.response';
import { MappingPlayerAbstract } from '../../../domain/pairs/services/mappingPlayer.abstract';
import { PairStatusesEnum } from '../../../domain/pairs/enums/pair-statuses.enum';

@Injectable()
export class GetMyCurrentAction extends MappingPlayerAbstract {
  public async execute(user: UserEntity): Promise<GetCurrentPairResponse> {
    const findActivePlayer = await this.repository.getUserUnfinishedGame(user);
    if (!findActivePlayer) {
      throw new NotFoundException();
    }

    if (findActivePlayer.status === PairStatusesEnum.PENDING_SECOND_PLAYER) {
      return this.mappingForPendingStatus(findActivePlayer);
    }
    return this.mappingForActiveStatus(findActivePlayer);
  }
}
