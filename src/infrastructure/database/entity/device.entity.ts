import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

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
export class Device {
  @Prop({ type: String, isRequired: true })
  id: string;

  @Prop({ type: String, isRequired: true })
  title: string;

  @Prop({ type: String, isRequired: true, unique: true })
  userId: string;

  @Prop({ type: String, isRequired: true, unique: true })
  deviceId: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
