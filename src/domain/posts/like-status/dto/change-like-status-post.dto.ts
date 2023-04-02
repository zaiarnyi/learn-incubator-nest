import { IsEnum, IsNotEmpty } from 'class-validator';
import { LikeStatusEnum } from '../../../../infrastructure/enums/like-status.enum';

export class ChangeLikeStatusPostDto {
  @IsEnum(LikeStatusEnum)
  @IsNotEmpty()
  likeStatus: LikeStatusEnum;
}
