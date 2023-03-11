import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ type: String, isRequired: true })
  title: string;

  @Prop({ type: String, isRequired: true })
  shortDescription: string;

  @Prop({ type: String, isRequired: true })
  content: string;

  @Prop({ type: String, isRequired: true })
  blogName: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
