import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SecurityDocument = HydratedDocument<Security>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'lastActiveDate' },
  validateBeforeSave: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Security {
  @Prop({ type: String, isRequired: true })
  ip: string;

  @Prop({ type: String, isRequired: true })
  title: string;

  @Prop({ type: String, isRequired: true })
  userId: string;
}

export const SecuritySchema = SchemaFactory.createForClass(Security);
