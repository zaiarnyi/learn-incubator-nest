import { LikeStatusEnum } from '../../../infrastructure/enums/like-status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeLikeStatusPostByIdRequest {
  @IsEnum(LikeStatusEnum)
  @IsNotEmpty()
  @ApiProperty({ type: 'enum', enum: LikeStatusEnum })
  likeStatus: LikeStatusEnum;
}
