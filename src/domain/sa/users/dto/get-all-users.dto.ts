import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { SortByEnum, SortDirection } from '../../../users/enums/sort.enum';
import { BanStatusEnum } from '../../../users/enums/banStatus.enum';

export class GetUsersDTO {
  @IsOptional()
  @IsString()
  @IsEnum(SortByEnum)
  sortBy: SortByEnum;

  @IsOptional()
  @IsString()
  @IsEnum(SortDirection)
  sortDirection: SortDirection;

  @IsOptional()
  @IsInt()
  pageNumber: number;

  @IsOptional()
  @IsInt()
  pageSize: number;

  @IsOptional()
  @IsString()
  searchLoginTerm: string;

  @IsOptional()
  @IsString()
  searchEmailTerm: string;

  @IsOptional()
  @IsString()
  @IsEnum(BanStatusEnum)
  banStatus: BanStatusEnum = BanStatusEnum.ALL;
}
