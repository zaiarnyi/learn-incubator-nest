import { Exclude, Expose } from 'class-transformer';
import { ExtendedLikesInfo } from './extendedLikesInfo.response';

@Exclude()
class CommentatorInfo {
  @Expose()
  userId: string;

  @Expose()
  userLogin: string;
}

@Exclude()
export class CommentResponse {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  commentatorInfo: CommentatorInfo;

  @Expose()
  createdAt: Date;

  @Expose()
  likesInfo: ExtendedLikesInfo;
}
