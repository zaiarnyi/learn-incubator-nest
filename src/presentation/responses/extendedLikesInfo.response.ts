import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

@Exclude()
export class ExtendedLikesInfo {
  @Expose()
  @IsInt()
  likesCount: number;

  @Expose()
  @IsInt()
  dislikesCount: number;

  @Expose()
  @IsEnum(StatusCommentEnum)
  myStatus: StatusCommentEnum;
}
