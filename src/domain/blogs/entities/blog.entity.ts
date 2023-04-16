import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

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
export class Blog {
  @Prop({ type: String, isRequired: true })
  name: string;

  @Prop({ type: String, isRequired: true })
  description: string;

  @Prop({ type: String, isRequired: true })
  websiteUrl: string;

  @Prop({ type: Boolean, default: false })
  isMembership: boolean;

  @Prop({ type: String, isRequired: false, default: null })
  userId: string;

  @Prop({ type: String, isRequired: false, default: null })
  userLogin: string;

  @Prop({ type: String, isRequired: true, default: false })
  isBanned: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
