import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoles } from '../../auth/enums/roles.enum';

export type UserDocument = HydratedDocument<User>;

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
export class User {
  @Prop({ type: String, isRequired: true, unique: true })
  login: string;

  @Prop({ type: String, isRequired: true, unique: true })
  email: number;

  @Prop({ type: String, isRequired: true })
  passwordHash: string;

  @Prop({ type: Boolean, default: false })
  isConfirm: boolean;

  @Prop({ type: Boolean, default: false })
  isSendEmail: boolean;

  @Prop({ enum: UserRoles, isRequired: true, type: String, default: UserRoles.USER })
  role: number;

  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

export class UserEntity {
  id: number;
  login: string;
  email: string;
  password_hash: string;
  is_confirm: boolean;
  is_send_email: boolean;
  role: UserRoles;
  is_banned: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
