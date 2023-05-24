import { IsArray, IsInt, IsOptional, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetUsersTopDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    return [value];
  })
  sort: string[];

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

export class PayloadQueryDto {
  sort: string[];
  limit: number;
  offset: number;
}
