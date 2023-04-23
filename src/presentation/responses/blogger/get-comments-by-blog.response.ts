import { Exclude, Expose, Type } from 'class-transformer';
import { MetaResponse } from '../meta.response';
import { ValidateNested } from 'class-validator';
import { ExtendedLikesInfo } from '../extendedLikesInfo.response';

@Exclude()
class CommentatorInfo {
  @Expose()
  userId: string;

  @Expose()
  userLogin: string;
}

@Exclude()
class PostInfo {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  blogId: string;

  @Expose()
  blogName: string;
}

@Exclude()
class CommentItem {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => ExtendedLikesInfo)
  @ValidateNested()
  likesInfo: ExtendedLikesInfo;

  @Expose()
  @Type(() => CommentatorInfo)
  @ValidateNested()
  commentatorInfo: CommentatorInfo;

  @Expose()
  @Type(() => PostInfo)
  @ValidateNested()
  postInfo: PostInfo;
}

@Exclude()
export class GetCommentsByBlogResponse extends MetaResponse {
  @Expose()
  @Type(() => CommentItem)
  @ValidateNested()
  items: CommentItem[];
}
