import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';
import { LikeStatusEnum } from '../../infrastructure/enums/like-status.enum';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ExtendedLikesInfo {
  @Expose()
  @IsInt()
  @ApiProperty({ type: Number, default: 0, nullable: false, required: true })
  likesCount = 0;

  @Expose()
  @IsInt()
  @ApiProperty({ type: Number, default: 0, nullable: false, required: true })
  dislikesCount = 0;

  @Expose()
  @IsEnum(LikeStatusEnum)
  @ApiProperty({ type: 'enum', enum: LikeStatusEnum, default: LikeStatusEnum.None, nullable: false, required: true })
  myStatus: LikeStatusEnum = LikeStatusEnum.None;
}
