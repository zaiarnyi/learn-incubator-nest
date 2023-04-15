import { Inject, Injectable } from '@nestjs/common';
import { GetUsersDTO } from '../../../../domain/sa/users/dto/get-all-users.dto';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';
import { GetUsersResponse } from '../../../../presentation/responses/sa/users/get-users.response';
import { plainToClass } from 'class-transformer';
import { QueryUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';

@Injectable()
export class GetAllUsersAction {
  constructor(
    private readonly queryRepository: UserQueryRepository,
    @Inject(QueryUserBannedRepository) private readonly bannedRepository: QueryUserBannedRepository,
  ) {}

  async execute(dto: GetUsersDTO): Promise<GetUsersResponse> {
    const totalCount = await this.queryRepository.getCountUsers(dto.searchLoginTerm, dto.searchEmailTerm);
    const skip = (dto.pageNumber - 1) * dto.pageSize;
    const pagesCount = Math.ceil(totalCount / dto.pageSize);

    const users = await this.queryRepository.getAllUsers(
      dto.searchLoginTerm,
      dto.searchEmailTerm,
      skip,
      dto.pageSize,
      dto.sortBy,
      dto.sortDirection,
    );

    const promises = users.map(async (item) => {
      const checkUserBanned = await this.bannedRepository.checkStatus(item._id.toString());
      return {
        id: item._id.toString(),
        ...item,
        ...(checkUserBanned && { banInfo: Object.assign(checkUserBanned, { isBanned: true }) }),
      };
    });

    return plainToClass(GetUsersResponse, {
      pagesCount,
      page: dto.pageNumber,
      pageSize: dto.pageSize,
      totalCount,
      items: await Promise.all(promises),
    });
  }
}
