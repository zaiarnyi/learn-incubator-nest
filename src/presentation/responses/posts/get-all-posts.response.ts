import { Exclude, Expose, Type } from 'class-transformer';
import { MetaResponse } from '../meta.response';
import { ExtendedLikesInfo } from '../extendedLikesInfo.response';
import { ValidateNested } from 'class-validator';
import { CreateImageResponse } from '../../requests/blogger/create-images.response';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class NewestLikes {
  @Expose()
  @ApiProperty({ type: Date, example: new Date(), nullable: false, required: true })
  addedAt: Date;

  @Expose()
  @ApiProperty({ type: String, example: '42', nullable: false, required: true })
  userId: string;

  @Expose()
  @ApiProperty({ type: String, example: 'login', nullable: false, required: true })
  login: string;
}

@Exclude()
export class LikesInfo extends ExtendedLikesInfo {
  @Expose()
  @ApiProperty({ type: NewestLikes, isArray: true, nullable: false, required: true, default: NewestLikes })
  newestLikes: NewestLikes[];
}

@Exclude()
export class GetPost {
  @ApiProperty({ type: String, example: 42, nullable: false, required: true })
  @Expose()
  id: string;

  @Expose()
  @ApiProperty({ type: String, example: 'some title', nullable: false, required: true })
  title: string;

  @Expose()
  @ApiProperty({ type: String, example: 'some short description', nullable: false, required: true })
  shortDescription: string;

  @Expose()
  @ApiProperty({ type: String, example: 'some content', nullable: false, required: true })
  content: string;

  @Expose()
  @ApiProperty({ type: String, example: 42, nullable: false, required: true })
  blogId: string;

  @Expose()
  @ApiProperty({ type: String, example: 'some blog name', nullable: false, required: true })
  blogName: string;

  @Expose()
  @ApiProperty({ type: Date, example: new Date(), nullable: false, required: true })
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: LikesInfo, nullable: false, required: true })
  extendedLikesInfo: LikesInfo;

  @Expose()
  @ValidateNested()
  @ApiProperty({ type: CreateImageResponse, nullable: false, required: true, default: CreateImageResponse })
  @Type(() => CreateImageResponse)
  images: CreateImageResponse;
}

@Exclude()
export class GetPostsResponse extends MetaResponse {
  @Expose()
  @ApiProperty({ type: GetPost, isArray: true, nullable: false, required: true, default: GetPost })
  items: GetPost[];
}
