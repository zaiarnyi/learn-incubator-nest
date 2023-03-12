import { MetaResponse } from '../meta.response';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
class CommentatorInfo {
  @Expose()
  userId: string;

  @Expose()
  userLogin: string;
}

@Exclude()
class PostCommentInfo {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  commentatorInfo: CommentatorInfo;
}

@Exclude()
export class GetCommentsByPostIdResponse extends MetaResponse {
  @Expose()
  items: PostCommentInfo[];
}
