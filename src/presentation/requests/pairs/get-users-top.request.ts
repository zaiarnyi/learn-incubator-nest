import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Max } from 'class-validator';

export class GetUsersTopRequest {
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
