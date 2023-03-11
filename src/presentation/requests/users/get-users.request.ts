import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator';
import {
  SortByEnum,
  SortDirection,
} from '../../../domain/users/enums/sort.enum';
import { Type } from 'class-transformer';

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
  @Type(() => Number)
  @IsInt()
  pageNumber = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(100)
  pageSize = 10;

  @IsOptional()
  @IsString()
  searchLoginTerm = '';

  @IsOptional()
  @IsString()
  searchEmailTerm = '';
}
