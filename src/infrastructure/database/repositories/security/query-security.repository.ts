import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Security, SecurityDocument } from '../../../../domain/security/entity/security.entity';

export class QuerySecurityRepository {
  constructor(@InjectModel(Security.name) private securityModel: Model<SecurityDocument>) {}

  public async getDevicesByUserId(userId: string): Promise<SecurityDocument[]> {
    return this.securityModel.find({ userId });
  }

  public async getDevicesByUserIdAndDevice(userId: string, deviceId: string): Promise<SecurityDocument> {
    return this.securityModel.findOne({ userId, deviceId });
  }

  public async getDeviceById(deviceId: string) {
    return this.securityModel.findOne({ deviceId });
  }
}
