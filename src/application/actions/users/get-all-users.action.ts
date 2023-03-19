import { Injectable } from '@nestjs/common';
import { GetUsersDTO } from '../../../domain/users/dto/get-all-users.dto';
import { UserQueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { GetUser, GetUsersResponse } from '../../../presentation/responses/users/get-users.response';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GetAllUsersAction {
  constructor(private readonly queryRepository: UserQueryRepository) {}

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

    return {
      pagesCount,
      page: dto.pageNumber,
      pageSize: 0,
      totalCount,
      items: users.map((item) => plainToClass(GetUser, { ...item, id: item._id.toString() })),
    };
  }
}
