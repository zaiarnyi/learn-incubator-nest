import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';
import { LikeStatusEnum } from '../../infrastructure/enums/like-status.enum';

@Exclude()
export class ExtendedLikesInfo {
  @Expose()
  @IsInt()
  likesCount = 0;

  @Expose()
  @IsInt()
  dislikesCount = 0;

  @Expose()
  @IsEnum(LikeStatusEnum)
  myStatus: LikeStatusEnum = LikeStatusEnum.None;
}
