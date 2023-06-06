import { Exclude, Expose, Type } from 'class-transformer';
import { MetaResponse } from '../meta.response';
import { ExtendedLikesInfo } from '../extendedLikesInfo.response';
import { ValidateNested } from 'class-validator';
import { CreateImageResponse } from '../../requests/blogger/create-images.response';

@Exclude()
export class NewestLikes {
  @Expose()
  addedAt: Date;

  @Expose()
  userId: string;

  @Expose()
  login: string;
}

@Exclude()
export class LikesInfo extends ExtendedLikesInfo {
  @Expose()
  newestLikes: NewestLikes[];
}

@Exclude()
export class GetPost {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  shortDescription: string;

  @Expose()
  content: string;

  @Expose()
  blogId: string;

  @Expose()
  blogName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  extendedLikesInfo: LikesInfo;

  @Expose()
  @ValidateNested()
  @Type(() => CreateImageResponse)
  images: CreateImageResponse;
}

@Exclude()
export class GetPostsResponse extends MetaResponse {
  @Expose()
  items: GetPost[];
}
