import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';
import { StatusCommentEnum } from '../../domain/posts/enums/status-comment.enum';

@Exclude()
export class ExtendedLikesInfo {
  @Expose()
  @IsInt()
  likesCount = 0;

  @Expose()
  @IsInt()
  dislikesCount = 0;

  @Expose()
  @IsEnum(StatusCommentEnum)
  myStatus: StatusCommentEnum = StatusCommentEnum.None;
}
