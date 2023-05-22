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
  private async checkOrder(payload: GetMyGamesDto, user: UserEntity): Promise<SortByEnum> {
    const games = await this.repository.getGamesForUser(user);
    const checkStatusPending = games.every((g) => g.status === PairStatusesEnum.PENDING_SECOND_PLAYER);
    const checkStatusActive = games.every((g) => g.status === PairStatusesEnum.ACTIVE);
    const checkStatusFinish = games.every((g) => g.status === PairStatusesEnum.FINISH);

    if (checkStatusActive || checkStatusFinish || checkStatusPending) {
      return SortByEnum.FINISH_CREATED_DATE;
    }
    return payload.sortBy;
  }
  public async execute(payload: GetMyGamesDto, user: UserEntity): Promise<GetMyGamesResponse | any> {
    const skip = (payload.pageNumber - 1) * payload.pageSize;
    payload.sortBy = await this.checkOrder(payload, user);

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
