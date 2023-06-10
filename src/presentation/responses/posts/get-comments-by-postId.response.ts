import { MetaResponse } from '../meta.response';
import { Exclude, Expose } from 'class-transformer';
import { ExtendedLikesInfo } from '../extendedLikesInfo.response';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
class CommentatorInfo {
  @Expose()
  @ApiProperty({ type: String, example: 42, nullable: false, required: true })
  userId: string;

  @Expose()
  @ApiProperty({ type: String, example: 'login', nullable: false, required: true })
  userLogin: string;
}

@Exclude()
export class PostCommentInfo {
  @Expose()
  @ApiProperty({ type: String, example: 42, nullable: false, required: true })
  id: string;

  @Expose()
  @ApiProperty({ type: String, example: 'some content', nullable: false, required: true })
  content: string;

  @Expose()
  @ApiProperty({
    type: CommentatorInfo,
    example: CommentatorInfo,
    nullable: false,
    required: true,
    default: CommentatorInfo,
  })
  commentatorInfo: CommentatorInfo;

  @Expose()
  @ApiProperty({
    type: Date,
    example: new Date(),
    nullable: false,
    required: true,
    default: new Date(),
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    type: ExtendedLikesInfo,
    nullable: false,
    required: true,
    default: ExtendedLikesInfo,
    example: ExtendedLikesInfo,
  })
  likesInfo: ExtendedLikesInfo;
}

@Exclude()
export class GetCommentsByPostIdResponse extends MetaResponse {
  @Expose()
  @ApiProperty({ type: PostCommentInfo, required: true, default: PostCommentInfo, isArray: true })
  items: PostCommentInfo[];
}
