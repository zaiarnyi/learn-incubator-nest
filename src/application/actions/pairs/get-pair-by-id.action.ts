import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { MappingPlayerAbstract } from '../../../domain/pairs/services/mappingPlayer.abstract';
import { GetCurrentPairResponse } from '../../../presentation/responses/pairs/get-current-pair.response';
import { PairStatusesEnum } from '../../../domain/pairs/enums/pair-statuses.enum';
import { UserEntity } from '../../../domain/users/entities/user.entity';

@Injectable()
export class GetPairByIdAction extends MappingPlayerAbstract {
  public async execute(id: number, user: UserEntity): Promise<GetCurrentPairResponse> {
    const findPairById = await this.repository.getPairById(id);

    if (!findPairById) {
      throw new BadRequestException([{ message: 'has invalid format', field: 'id' }]);
    }

    if (findPairById.firstPlayer.id !== user.id && findPairById.secondPlayer?.id !== user.id) {
      throw new ForbiddenException();
    }

    if (findPairById.status === PairStatusesEnum.PENDING_SECOND_PLAYER) {
      return this.mappingForPendingStatus(findPairById);
    }

    return this.mappingForActiveStatus(findPairById);
  }
}
