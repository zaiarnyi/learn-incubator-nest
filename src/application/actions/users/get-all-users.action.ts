import { Injectable } from '@nestjs/common';
import { GetUsersDTO } from '../../../domain/users/dto/get-all-users.dto';
import { QueryRepository } from '../../../infrastructure/database/repositories/users/query.repository';
import { GetUsersResponse } from '../../../presentation/responses/users/get-users.response';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GetAllUsersAction {
  constructor(private readonly queryRepository: QueryRepository) {}
  async getAllUsers(dto: GetUsersDTO): Promise<GetUsersResponse> {
    const totalCount = await this.queryRepository.getCountUsers(
      dto.searchLoginTerm,
      dto.searchEmailTerm,
    );
    const skip = (dto.pageNumber - 1) * dto.pageSize;
    const pagesCount = Math.ceil(totalCount / dto.pageSize);

    const users = await this.queryRepository.getAllUsers(
      dto.searchLoginTerm,
      dto.searchEmailTerm,
      skip,
      dto.pageSize,
    );

    return plainToClass(GetUsersResponse, {
      pagesCount,
      page: dto.pageNumber,
      pageSize: 0,
      totalCount,
      items: users,
    });
  }
}
