import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator';
import { BlogSortByEnum, BlogSortDirection } from '../enums/blog-sort.enum';

export class GetBlogsDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  pageNumber = 1;

  @Type(() => Number)
  @IsInt()
  @Max(100)
  @IsOptional()
  pageSize = 10;

  @IsString()
  @IsOptional()
  @IsEnum(BlogSortByEnum)
  sortBy: BlogSortByEnum = BlogSortByEnum.CREATED_AT;

  @IsString()
  @IsOptional()
  @IsEnum(BlogSortDirection)
  sortDirection: BlogSortDirection = BlogSortDirection.ASC;

  @IsString()
  @IsOptional()
  searchNameTerm: string;
}
