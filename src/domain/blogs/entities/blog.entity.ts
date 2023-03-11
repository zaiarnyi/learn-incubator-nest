import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ type: String, isRequired: true })
  name: string;

  @Prop({ type: String, isRequired: true })
  description: string;

  @Prop({ type: String, isRequired: true })
  websiteUrl: string;

  @Prop({ type: Boolean, default: false })
  isMembership: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
