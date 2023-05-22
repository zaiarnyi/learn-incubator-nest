import { IsEnum, IsInt, IsOptional, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SortByEnum } from '../../../domain/pairs/enums/sortBy.enum';

export class GetMyGamesRequest {
  @IsOptional()
  @IsEnum(SortByEnum)
  sortBy: SortByEnum;

  @IsOptional()
  @IsEnum(['desc', 'asc', 'DESC', 'ASC'])
  @Transform(({ value }) => {
    if (!value) return 'DESC';
    return value.toUpperCase();
  })
  sortDirection: 'DESC' | 'ASC' = 'DESC';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pageNumber = 1;

  @Type(() => Number)
  @IsInt()
  @Max(100)
  @IsOptional()
  pageSize = 10;
}
