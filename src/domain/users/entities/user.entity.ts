import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
