import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { GetCurrentPairResponse } from '../../../presentation/responses/pairs/get-current-pair.response';
import { PairStatusesEnum } from '../../../domain/pairs/enums/pair-statuses.enum';
import { MappingPlayerAbstract } from '../../../domain/pairs/services/mappingPlayer.abstract';

@Injectable()
export class GetMyCurrentAction extends MappingPlayerAbstract {
  public async execute(user: UserEntity): Promise<GetCurrentPairResponse> {
    const findActivePlayer = await this.repository.getUserUnfinishedGame(user);
    if (!findActivePlayer || findActivePlayer.status === PairStatusesEnum.FINISH) {
      throw new NotFoundException();
    }

    if (findActivePlayer.status === PairStatusesEnum.ACTIVE) {
      return this.mappingForActiveStatus(findActivePlayer);
    }

    return this.mappingForPendingStatus(findActivePlayer);
  }
}
