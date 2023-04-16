import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

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
export class Post {
  @Prop({ type: String, isRequired: true })
  title: string;

  @Prop({ type: String, isRequired: true })
  shortDescription: string;

  @Prop({ type: String, isRequired: true })
  content: string;

  @Prop({ type: String, isRequired: true })
  blogName: string;

  @Prop({ type: String, isRequired: true })
  blogId: string;

  @Prop({ type: String, isRequired: false })
  userId: string;

  @Prop({ type: String, isRequired: true, default: false })
  isBanned: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
