import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator';
import { SortByEnum, SortDirection } from '../../../../domain/users/enums/sort.enum';
import { Transform } from 'class-transformer';
import { BanStatusEnum } from '../../../../domain/users/enums/banStatus.enum';

export class GetUsersRequest {
  @IsOptional()
  @IsString()
  @IsEnum(SortByEnum)
  sortBy: SortByEnum = SortByEnum.CREATED_AT;

  @IsOptional()
  @IsString()
  @IsEnum(SortDirection)
  sortDirection: SortDirection = SortDirection.DESC;

  @IsOptional()
  @Transform(({ value }) => value && parseInt(value, 10))
  @IsInt()
  pageNumber = 1;

  @IsOptional()
  @Transform(({ value }) => value && parseInt(value, 10))
  @IsInt()
  @Max(100)
  pageSize = 10;

  @IsOptional()
  @IsString()
  searchLoginTerm = '';

  @IsOptional()
  @IsString()
  searchEmailTerm = '';

  @IsOptional()
  @IsString()
  @IsEnum(BanStatusEnum)
  banStatus: BanStatusEnum = BanStatusEnum.ALL;
}
