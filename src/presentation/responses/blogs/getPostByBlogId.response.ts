import { MetaResponse } from '../meta.response';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ExtendedLikesInfo } from '../extendedLikesInfo.response';

@Exclude()
class newestLikePost {
  @Expose()
  addedAt: Date;

  @Expose()
  userId: string;

  @Expose()
  login: string;
}

@Exclude()
class ExtendedLikesInfoPost extends ExtendedLikesInfo {
  @Expose()
  newestLikePost: newestLikePost[];
}

@Exclude()
export class PostByBlogItem {
  @Expose({ name: '_id' })
  @Transform(({ value }) => value?.toString())
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
  extendedLikesInfo: ExtendedLikesInfoPost;
}

@Exclude()
export class GetPostByBlogIdResponse extends MetaResponse {
  @Expose()
  items: PostByBlogItem[];
}
