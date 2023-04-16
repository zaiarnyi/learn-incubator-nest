import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

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
export class Comment {
  @Prop({ type: String, isRequired: true })
  content: string;

  @Prop({ type: String, isRequired: true })
  userId: string;

  @Prop({ type: String, isRequired: true })
  userLogin: string;

  @Prop({ type: String, isRequired: true })
  postId: string;

  @Prop({ type: Boolean, isRequired: true, default: false })
  isBanned: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
