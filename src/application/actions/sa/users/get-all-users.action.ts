import { Inject, Injectable } from '@nestjs/common';
import { GetUsersDTO } from '../../../../domain/sa/users/dto/get-all-users.dto';
import { UserQueryRepository } from '../../../../infrastructure/database/repositories/users/query.repository';
import { GetUsersResponse } from '../../../../presentation/responses/sa/users/get-users.response';
import { plainToClass } from 'class-transformer';
import { QueryUserBannedRepository } from '../../../../infrastructure/database/repositories/sa/users/query-user-banned.repository';
import { BanStatusEnum } from '../../../../domain/users/enums/banStatus.enum';

@Injectable()
export class GetAllUsersAction {
  constructor(
    private readonly queryRepository: UserQueryRepository,
    @Inject(QueryUserBannedRepository) private readonly bannedRepository: QueryUserBannedRepository,
  ) {}

  private checkStatus(status: string): { isBanned?: boolean } {
    switch (true) {
      case status === BanStatusEnum.BANNED:
        return { isBanned: true };
      case status === BanStatusEnum.NOT_BANNED:
        return { isBanned: false };
      default:
        return {};
    }
  }

  private async checkUserBanStatus(userId: string) {
    const checkUserBanned = await this.bannedRepository.checkStatus(userId);
    if (!checkUserBanned) {
      return { isBanned: false, banDate: null, banReason: null };
    }
    return Object.assign(checkUserBanned, { isBanned: true });
  }

  async execute(dto: GetUsersDTO): Promise<GetUsersResponse> {
    const statusFilter = this.checkStatus(dto.banStatus);
    const totalCount = await this.queryRepository.getCountUsers(dto.searchLoginTerm, dto.searchEmailTerm, statusFilter);
    const skip = (dto.pageNumber - 1) * dto.pageSize;
    const pagesCount = Math.ceil(totalCount / dto.pageSize);

    const users = await this.queryRepository.getAllUsers(
      dto.searchLoginTerm,
      dto.searchEmailTerm,
      skip,
      dto.pageSize,
      dto.sortBy,
      dto.sortDirection,
      statusFilter,
    );

    const promises = users.map(async (item) => {
      const banInfo = await this.checkUserBanStatus(item._id.toString());
      return {
        id: item._id.toString(),
        ...item,
        banInfo,
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
