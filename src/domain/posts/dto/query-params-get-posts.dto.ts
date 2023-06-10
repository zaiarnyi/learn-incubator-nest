import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator';
import { PostSortByEnum, PostSortDirection } from '../enums/sort.enum';
import { SubscriptionStatusPostEnum } from '../enums/subscription-status-post.enum';

export class QueryParamsGetPostsDto {
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

  @IsOptional()
  @IsEnum(SubscriptionStatusPostEnum)
  subscriptionStatus: SubscriptionStatusPostEnum = SubscriptionStatusPostEnum.ALL;
}
