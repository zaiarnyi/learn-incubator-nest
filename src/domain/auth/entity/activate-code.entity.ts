import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserEntity } from '../../users/entities/user.entity';

export type ActivateCodeDocument = HydratedDocument<ActivateCode>;

export enum ActivateCodeEnum {
  REGISTRATION = 'registration',
  RECOVERY = 'recovery',
}

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
export class ActivateCode {
  @Prop({ type: String, isRequired: true, unique: true })
  code: string;

  @Prop({ type: Number, isRequired: true })
  expireAt: number;

  @Prop({ type: String, isRequired: true })
  userId: string;

  @Prop({ type: String, isRequired: true })
  type: string;
}

export const ActivateCodeSchema = SchemaFactory.createForClass(ActivateCode);

export class ActivateEmailsCodeEntity {
  id: number;
  code: string;
  expireAt: number;
  user: UserEntity | number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
