import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeLikeStatusPostByIdRequest {
  @IsEnum(LikeStatusEnum)
  @IsNotEmpty()
  likeStatus: LikeStatusEnum;
}
