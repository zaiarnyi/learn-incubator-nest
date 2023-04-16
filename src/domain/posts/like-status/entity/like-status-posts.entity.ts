import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LikeStatusEnum } from '../../../../infrastructure/enums/like-status.enum';

export type LikeStatusPostsDocument = HydratedDocument<LikeStatusPosts>;

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
export class LikeStatusPosts {
  @Prop({ type: String, isRequired: true })
  userId: string;

  @Prop({ type: Boolean, isRequired: false, default: false })
  like: boolean;

  @Prop({ type: Boolean, isRequired: false, default: false })
  dislike: boolean;

  @Prop({ enum: LikeStatusEnum, isRequired: true, type: String, default: LikeStatusEnum.None })
  myStatus: LikeStatusEnum;

  @Prop({ type: String, isRequired: true })
  postId: string;

  @Prop({ type: String, isRequired: true })
  login: string;

  @Prop({ type: Boolean, isRequired: false, default: false })
  isBanned: boolean;
}

export const LikeStatusPostsSchema = SchemaFactory.createForClass(LikeStatusPosts);
