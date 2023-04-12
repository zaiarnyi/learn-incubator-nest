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

  public async deleteAllExcludeCurrent(deviceId: string, userId: string): Promise<DeleteResult> {
    return this.securityRepository.deleteMany({ userId, deviceId: { $nin: [deviceId] } });
  }

  public async deleteCurrent(deviceId: string, userId: string) {
    return this.securityRepository.findOneAndRemove({ deviceId, userId });
  }
  public async deleteDeviceForUser(deviceId: string, userId: string) {
    return this.securityRepository.findOneAndRemove({ deviceId, userId });
  }

  public async deleteAll() {
    return this.securityRepository.deleteMany({});
  }

  public async getDevice(deviceId: string): Promise<SecurityDocument> {
    return this.securityRepository.findOne({ deviceId });
  }

  public async updateDevice(payload: SecurityDocument): Promise<SecurityDocument> {
    return this.securityRepository.findOneAndUpdate({ deviceId: payload._id.toString() }, payload);
  }
}
