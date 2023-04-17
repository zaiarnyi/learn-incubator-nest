import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { BlogSortByEnum, BlogSortDirection } from '../../../blogs/enums/blog-sort.enum';

export class GetBlogsDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  pageNumber = 1;

  @Max(100)
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  pageSize = 10;

  @IsString()
  @IsOptional()
  @IsEnum(BlogSortByEnum)
  sortBy: BlogSortByEnum = BlogSortByEnum.CREATED_AT;

  @IsString()
  @IsOptional()
  @IsEnum(BlogSortDirection)
  sortDirection: BlogSortDirection = BlogSortDirection.DESC;

  @IsString()
  @IsOptional()
  searchNameTerm = '';
}
