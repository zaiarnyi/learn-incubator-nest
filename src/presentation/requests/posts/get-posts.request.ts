import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  PostSortByEnum,
  PostSortDirection,
} from '../../../domain/posts/enums/sort.enum';

export class GetPostsRequest {
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
  @IsEnum(PostSortByEnum)
  sortBy: PostSortByEnum = PostSortByEnum.CREATED_AT;

  @IsString()
  @IsOptional()
  @IsEnum(PostSortDirection)
  sortDirection: PostSortDirection = PostSortDirection.DESC;
}
