import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserBannedDocument = HydratedDocument<UserBanned>;

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

  @Prop({ type: String, isRequired: true, unique: true })
  userId: string;
}

export const UserBannedSchema = SchemaFactory.createForClass(UserBanned);
