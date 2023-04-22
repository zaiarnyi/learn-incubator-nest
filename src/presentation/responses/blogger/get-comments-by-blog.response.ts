import { Exclude, Expose, Type } from 'class-transformer';
import { MetaResponse } from '../meta.response';
import { ValidateNested } from 'class-validator';

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
  @Type(() => CommentatorInfo)
  @ValidateNested()
  commentatorInfo: CommentatorInfo;

  @Expose()
  createdAt: Date;

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
