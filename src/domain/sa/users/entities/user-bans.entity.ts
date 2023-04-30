import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserEntity } from '../../../users/entities/user.entity';

export type UserBannedDocument = HydratedDocument<UserBanned & { banDate: Date }>;

@Schema({
  timestamps: { createdAt: 'banDate' },
  validateBeforeSave: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class UserBanned {
  @Prop({ type: String, isRequired: true })
  banReason: string;

  @Prop({ type: String, isRequired: true })
  userId: string;

  @Prop({ type: String, isRequired: true })
  userLogin: string;

  @Prop({ type: String, isRequired: false, default: null })
  blogId: string;
}

export const UserBannedSchema = SchemaFactory.createForClass(UserBanned);

export class UserBannedEntity {
  id: number;
  banReason: string;
  user: UserEntity | number;
  blogId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
