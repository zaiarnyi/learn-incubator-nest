import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserEntity } from '../../users/entities/user.entity';

export type InvalidTokensDocument = HydratedDocument<InvalidTokens>;

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
export class InvalidTokens {
  @Prop({ type: String, isRequired: true })
  token: string;
}

export const InvalidTokensSchema = SchemaFactory.createForClass(InvalidTokens);

export class InvalidTokensEntity {
  id: number;
  user: UserEntity | number;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
