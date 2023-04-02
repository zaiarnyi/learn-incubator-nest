import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LikeStatusEnum } from '../../../../infrastructure/enums/like-status.enum';

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
}

export const LikeStatusCommentSchema = SchemaFactory.createForClass(LikeStatusComment);
