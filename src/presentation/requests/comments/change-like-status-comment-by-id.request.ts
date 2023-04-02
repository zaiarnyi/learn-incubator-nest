import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeLikeStatusCommentByIdRequest {
  @IsEnum(LikeStatusEnum)
  @IsNotEmpty()
  likeStatus: LikeStatusEnum;
}
