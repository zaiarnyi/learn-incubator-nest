import { SecurityEntity } from '../../../../domain/security/entity/security.entity';
import { DeviceDto } from '../../../../domain/security/dto/device.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { UserEntity } from '../../../../domain/users/entities/user.entity';

export class MainSecurityRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(SecurityEntity) private readonly repository: Repository<SecurityEntity>,
  ) {}

  public async insertDevice(device: DeviceDto) {
    return this.repository.save(device);
  }

  public async deleteAllExcludeCurrent(deviceId: number, user: UserEntity) {
    await this.repository.delete({ id: Not(deviceId), user });
  }

  public async deleteCurrent(deviceId: number, user: UserEntity) {
    return this.repository.delete({ id: deviceId, user });
  }
  public async deleteDeviceForUser(deviceId: number, user: UserEntity) {
    return this.repository.delete({ id: deviceId, user });
  }

  public async getDevice(deviceId: number): Promise<SecurityEntity> {
    return this.repository.findOne({ where: { id: deviceId } });
  }

  public async updateDevice(payload: SecurityEntity) {
    await this.repository.update(
      { id: payload.id },
      { ip: payload.ip, title: payload.title, userAgent: payload.userAgent },
    );
  }
}
