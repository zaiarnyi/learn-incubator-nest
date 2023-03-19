import { Exclude, Expose, Transform } from 'class-transformer';
import { MetaResponse } from '../meta.response';
import { ExtendedLikesInfo } from '../extendedLikesInfo.response';

@Exclude()
class NewestLikes {
  @Expose()
  addedAt: Date;

  @Expose()
  userId: string;

  @Expose()
  login: string;
}

@Exclude()
class LikesInfo extends ExtendedLikesInfo {
  @Expose()
  newestLikes: NewestLikes[];
}

@Exclude()
export class GetPost {
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
}

@Exclude()
export class GetPostsResponse extends MetaResponse {
  @Expose()
  items: GetPost[];
}
