import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LikeStatusEnum } from '../../../../infrastructure/enums/like-status.enum';
import { UserEntity } from '../../../users/entities/user.entity';
import { CommentsEntity } from '../../entities/comment.entity';

export type LikeStatusCommentDocument = HydratedDocument<LikeStatusComment>;

@Schema({
  timestamps: true,
  validateBeforeSave: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class LikeStatusComment {
  @Prop({ type: String, isRequired: true })
  userId: string;

  @Prop({ type: Boolean, isRequired: false, default: false })
  like: boolean;

  @Prop({ type: Boolean, isRequired: false, default: false })
  dislike: boolean;

  @Prop({ enum: LikeStatusEnum, isRequired: true, type: String, default: LikeStatusEnum.None })
  myStatus: LikeStatusEnum;

  @Prop({ type: String, isRequired: true })
  commentId: string;

  @Prop({ type: Boolean, isRequired: false, default: false })
  isBanned: boolean;
}

export const LikeStatusCommentSchema = SchemaFactory.createForClass(LikeStatusComment);

export class CommentLikesEntity {
  id: number;
  user: UserEntity | number;
  comment: CommentsEntity | number;
  like: boolean;
  dislike: boolean;
  my_status: LikeStatusEnum;
  is_banned: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
