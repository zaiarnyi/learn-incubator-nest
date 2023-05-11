import { SecurityEntity } from '../../../../domain/security/entity/security.entity';
import { DeviceDto } from '../../../../domain/security/dto/device.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

export class MainSecurityRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(SecurityEntity) private readonly repository: Repository<SecurityEntity>,
  ) {}

  public async insertDevice(device: DeviceDto) {
    return this.repository.insert(device);
  }

  public async deleteAllExcludeCurrent(deviceId: number, userId: number) {
    await this.repository
      .createQueryBuilder('s')
      .leftJoin('s."user"', 'u')
      .where('s.id <> :id', { id: deviceId })
      .andWhere('u."id" = :userId', { userId })
      .delete();
  }

  public async deleteCurrent(deviceId: number, userId: number) {
    await this.repository
      .createQueryBuilder('s')
      .leftJoin('s."user"', 'u')
      .where('s.id = :id', { id: deviceId })
      .andWhere('u."id" = :userId', { userId });
  }
  public async deleteDeviceForUser(deviceId: number, userId: number) {
    return this.repository
      .createQueryBuilder('s')
      .leftJoin('s."user"', 'u')
      .where('s.id = :id', { id: deviceId })
      .andWhere('u."id" = :userId', { userId });
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
