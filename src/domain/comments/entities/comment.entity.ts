import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserEntity } from '../../users/entities/user.entity';
import { BlogEntity } from '../../blogs/entities/blog.entity';
import { PostEntity } from '../../posts/entities/post.entity';

export type CommentDocument = HydratedDocument<Comment & { createdAt: Date; updatedAt: Date }>;

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

  @Prop({ type: String, isRequired: true })
  blogId: string;

  @Prop({ type: Boolean, isRequired: true, default: false })
  isBanned: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export class CommentsEntity {
  id: number;
  content: string;
  user: UserEntity | number;
  blog: BlogEntity | number;
  post: PostEntity | number;
  is_banned: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
