import { IsEnum, IsInt, IsOptional, Max } from 'class-validator';
import { SortByEnum } from '../enums/sortBy.enum';
import { Transform, Type } from 'class-transformer';

export class GetMyGamesDto {
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
