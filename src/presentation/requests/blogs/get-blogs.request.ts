import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator';
import { BlogSortByEnum, BlogSortDirection } from '../../../domain/blogs/enums/blog-sort.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetBlogsRequest {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiProperty({ type: Number, example: 42, default: 1, nullable: false, required: false })
  pageNumber = 1;

  @Type(() => Number)
  @IsInt()
  @Max(100)
  @IsOptional()
  @ApiProperty({ type: Number, example: 42, default: 10, nullable: false, required: false })
  pageSize = 10;

  @IsString()
  @IsOptional()
  // @IsEnum(BlogSortByEnum)
  @ApiProperty({ type: Number, example: 42, default: BlogSortByEnum.CREATED_AT, nullable: false, required: false })
  sortBy = BlogSortByEnum.CREATED_AT;

  @IsString()
  @IsOptional()
  // @IsEnum(BlogSortDirection)
  @ApiProperty({ type: Number, example: 42, default: BlogSortDirection.DESC, nullable: false, required: false })
  sortDirection: BlogSortDirection = BlogSortDirection.DESC;
}

export class GetBlogsRequestWithSearch extends GetBlogsRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, required: false, nullable: false })
  searchNameTerm: string;
}
