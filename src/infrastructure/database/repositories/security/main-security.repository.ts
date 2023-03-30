import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Security, SecurityDocument } from '../../../../domain/security/entity/security.entity';
import { DeviceDto } from '../../../../domain/security/dto/device.dto';
import { UpdateResult, DeleteResult } from 'mongodb';

export class MainSecurityRepository {
  constructor(@InjectModel(Security.name) private securityRepository: Model<SecurityDocument>) {}

  public async insertDevice(device: DeviceDto | null): Promise<SecurityDocument | UpdateResult> {
    if (!device) return;
    const hasUserDevice = await this.securityRepository.findOne({ userId: device.userId });
    if (hasUserDevice) {
      return this.securityRepository.findOneAndUpdate({ userId: device.userId }, device);
    }
    return this.securityRepository.create(device);
  }

  public async deleteAllExcludeCurrent(userId: string, deviceId: string): Promise<DeleteResult> {
    return this.securityRepository.deleteMany({ userId, _id: { $ne: new Object(deviceId) } });
  }

  public async deleteCurrent(deviceId: string) {
    return this.securityRepository.findByIdAndDelete(deviceId);
  }
}
