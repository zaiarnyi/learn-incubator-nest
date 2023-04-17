import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { BlogSortByEnum, BlogSortDirection } from '../../../../domain/blogs/enums/blog-sort.enum';

export class GetBlogListRequest {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value.trim()) || 1)
  pageNumber = 1;

  @Max(100)
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value.trim()) || 10)
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
