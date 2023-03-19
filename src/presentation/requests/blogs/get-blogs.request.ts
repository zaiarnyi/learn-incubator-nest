import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator';
import { BlogSortByEnum, BlogSortDirection } from '../../../domain/blogs/enums/blog-sort.enum';

export class GetBlogsRequest {
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
  // @IsEnum(BlogSortByEnum)
  sortBy = BlogSortByEnum.CREATED_AT;

  @IsString()
  @IsOptional()
  @IsEnum(BlogSortDirection)
  sortDirection: BlogSortDirection = BlogSortDirection.DESC;
}

export class GetBlogsRequestWithSearch extends GetBlogsRequest {
  @IsString()
  @IsOptional()
  searchNameTerm: string;
}
