import { Inject, Injectable } from '@nestjs/common';
import { GetUsersTopDto, PayloadQueryDto } from '../../../domain/pairs/dto/get-users-top.dto';
import { GetUsersTopResponse } from '../../../presentation/responses/pairs/get-users-top.response';
import { QueryPairsRepository } from '../../../infrastructure/database/repositories/pairs/query.repository';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GetUsersTopAction {
  constructor(@Inject(QueryPairsRepository) protected readonly repository: QueryPairsRepository) {}

  public async execute(payload: GetUsersTopDto): Promise<GetUsersTopResponse> {
    const offset = (payload.pageNumber - 1) * payload.pageSize;

    const body = new PayloadQueryDto();
    body.sort = payload.sort;
    body.offset = offset;
    body.limit = payload.pageSize;

    const [users, totalCount] = await this.repository.getResultAndMany(body);
    const pagesCount = Math.ceil(totalCount / payload.pageSize);

    const mappingUser = users.map((item) => {
      const gamesCount = item.drawCount + item.lossesCount + item.winsCount;
      return {
        ...item,
        gamesCount,
        player: {
          id: item.user.id.toString(),
          login: item.user.login,
        },
      };
    });

    return plainToClass(GetUsersTopResponse, {
      pagesCount,
      page: payload.pageNumber,
      pageSize: payload.pageSize,
      totalCount,
      items: mappingUser,
    });
  }
}
