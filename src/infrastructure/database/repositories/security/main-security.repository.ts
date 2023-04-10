import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Security, SecurityDocument } from '../../../../domain/security/entity/security.entity';
import { DeviceDto } from '../../../../domain/security/dto/device.dto';
import { UpdateResult, DeleteResult } from 'mongodb';

export class MainSecurityRepository {
  constructor(@InjectModel(Security.name) private securityRepository: Model<SecurityDocument>) {}

  public async insertDevice(device: DeviceDto | null): Promise<SecurityDocument | UpdateResult> {
    if (!device) return;
    return this.securityRepository.create(device);
  }

  public async deleteAllExcludeCurrent(userId: string, deviceId: string): Promise<DeleteResult> {
    return this.securityRepository.deleteMany({ userId, _id: { $ne: new Object(deviceId) } });
  }

  public async deleteCurrent(deviceId: string) {
    return this.securityRepository.findByIdAndDelete(deviceId);
  }
  public async deleteDeviceForUser(deviceId: string, userId: string) {
    return this.securityRepository.findOneAndRemove({ id: deviceId, userId });
  }

  public async deleteAll() {
    return this.securityRepository.deleteMany();
  }

  public async getDevice(deviceId: string): Promise<SecurityDocument> {
    return this.securityRepository.findById(deviceId);
  }

  public async updateDevice(payload: SecurityDocument): Promise<SecurityDocument> {
    return this.securityRepository.findByIdAndUpdate(payload._id.toString(), payload);
  }
}
