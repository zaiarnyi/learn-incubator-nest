import { IsEnum, IsNotEmpty } from 'class-validator';
import { LikeStatusEnum } from '../../../../infrastructure/enums/like-status.enum';

export class ChangeLikeStatusDto {
  @IsEnum(LikeStatusEnum)
  @IsNotEmpty()
  likeStatus: LikeStatusEnum;
}
