import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Max } from 'class-validator';
import { BlogSortByEnum, BlogSortDirection } from '../../../../domain/blogs/enums/blog-sort.enum';

export class GetBlogListRequest {
  @Transform((value) => value && Number(value))
  @IsInt()
  @IsPositive()
  @IsOptional()
  pageNumber = 1;

  @IsInt()
  @Max(100)
  @IsPositive()
  @IsOptional()
  @Transform((value) => value && Number(value))
  pageSize = 10;

  @IsString()
  @IsOptional()
  // @IsEnum(BlogSortByEnum)
  sortBy: BlogSortByEnum = BlogSortByEnum.CREATED_AT;

  @IsString()
  @IsOptional()
  // @IsEnum(BlogSortDirection)
  sortDirection: BlogSortDirection = BlogSortDirection.DESC;

  @IsString()
  @IsOptional()
  searchNameTerm: string;
}
