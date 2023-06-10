import { IsEnum, IsInt, IsOptional, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PostSortByEnum, PostSortDirection } from '../../../domain/posts/enums/sort.enum';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatusPostEnum } from '../../../domain/posts/enums/subscription-status-post.enum';

export class GetPostsRequest {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiProperty({ type: Number, default: 1, example: 42, nullable: false, required: false })
  pageNumber = 1;

  @Type(() => Number)
  @IsInt()
  @Max(100)
  @IsOptional()
  @ApiProperty({ type: Number, default: 10, example: 42, nullable: false, required: false })
  pageSize = 10;

  @IsString()
  @IsOptional()
  @IsEnum(PostSortByEnum)
  @ApiProperty({
    type: 'enum',
    enum: PostSortByEnum,
    default: PostSortByEnum.CREATED_AT,
    example: PostSortByEnum.CREATED_AT,
    nullable: false,
    required: false,
  })
  sortBy: PostSortByEnum = PostSortByEnum.CREATED_AT;

  @IsString()
  @IsOptional()
  @IsEnum(PostSortDirection)
  @ApiProperty({
    type: 'enum',
    enum: PostSortDirection,
    default: PostSortDirection.DESC,
    example: PostSortDirection.DESC,
    nullable: false,
    required: false,
  })
  sortDirection: PostSortDirection = PostSortDirection.DESC;

  @IsOptional()
  @IsEnum(SubscriptionStatusPostEnum)
  @ApiProperty({
    type: 'enum',
    enum: SubscriptionStatusPostEnum,
    default: SubscriptionStatusPostEnum.ALL,
    example: SubscriptionStatusPostEnum.ALL,
    description: 'Returns posts from all blogs or only from blogs on which user subscribed Default: all',
    nullable: false,
    required: false,
  })
  subscriptionStatus: SubscriptionStatusPostEnum = SubscriptionStatusPostEnum.ALL;
}
