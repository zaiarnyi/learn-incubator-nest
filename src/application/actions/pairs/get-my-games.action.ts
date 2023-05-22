import { Injectable } from '@nestjs/common';
import { GetMyGamesResponse } from '../../../presentation/responses/pairs/get-my-games.response';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { GetMyGamesDto } from '../../../domain/pairs/dto/get-my-games.dto';
import { MappingPlayerAbstract } from '../../../domain/pairs/services/mappingPlayer.abstract';
import { PairStatusesEnum } from '../../../domain/pairs/enums/pair-statuses.enum';
import { plainToClass } from 'class-transformer';
import { SortByEnum } from '../../../domain/pairs/enums/sortBy.enum';

@Injectable()
export class GetMyGamesAction extends MappingPlayerAbstract {
  private async checkOrder(payload: GetMyGamesDto, user: UserEntity) {
    const games = await this.repository.getGamesForUser(user);
    const checkStatusPending = games.every((g) => g.status === PairStatusesEnum.PENDING_SECOND_PLAYER);
    const checkStatusActive = games.every((g) => g.status === PairStatusesEnum.ACTIVE);
    const checkStatusFinish = games.every((g) => g.status === PairStatusesEnum.FINISH);

    if (checkStatusActive || checkStatusFinish || checkStatusPending) {
      payload.sortBy = SortByEnum.ID;
      payload.sortDirection = 'DESC';
    }

    if (payload.sortBy === SortByEnum.PAIR_CREATED_DATE) {
      payload.sortBy = SortByEnum.ID;
    }
  }
  public async execute(payload: GetMyGamesDto, user: UserEntity): Promise<GetMyGamesResponse> {
    const skip = (payload.pageNumber - 1) * payload.pageSize;
    await this.checkOrder(payload, user);
    console.log(payload.sortBy, payload.sortDirection);
    const [pairs, totalCount] = await this.repository.getMyGames(payload, user, skip);
    const pagesCount = Math.ceil(totalCount / payload.pageSize);

    const promises = pairs.map(async (item) => {
      if (item.status === PairStatusesEnum.PENDING_SECOND_PLAYER) {
        return this.mappingForPendingStatus(item);
      }
      return this.mappingForActiveStatus(item);
    });
    return plainToClass(GetMyGamesResponse, {
      pagesCount,
      page: payload.pageNumber,
      pageSize: payload.pageSize,
      totalCount,
      items: await Promise.all(promises),
    });
  }
}
