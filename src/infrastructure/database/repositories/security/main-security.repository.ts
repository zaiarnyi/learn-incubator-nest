import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Security, SecurityDocument, SecurityEntity } from '../../../../domain/security/entity/security.entity';
import { DeviceDto } from '../../../../domain/security/dto/device.dto';
import { UpdateResult, DeleteResult } from 'mongodb';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class MainSecurityRepository {
  constructor(
    @InjectModel(Security.name) private securityRepository: Model<SecurityDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  public async insertDevice(device: DeviceDto): Promise<SecurityEntity> {
    const deviceCreated = await this.dataSource.query(
      `INSERT INTO user_security ("ip", "title", "user", "userAgent") VALUES ($1, $2, $3, $4) RETURNING *`,
      [device.ip, device.title, device.user, device.userAgent],
    );

    return deviceCreated[0];
  }

  public async deleteAllExcludeCurrent(deviceId: number, userId: number) {
    await this.dataSource.query(`DELETE FROM user_security WHERE id <> $1 AND "user" = $2`, [deviceId, userId]);
  }

  public async deleteCurrent(deviceId: number, userId: number) {
    await this.dataSource.query(`DELETE FROM user_security WHERE id = $1 AND "user" = $2`, [deviceId, userId]);
  }
  public async deleteDeviceForUser(deviceId: number, userId: number) {
    return this.dataSource.query(`DELETE FROM user_security WHERE id = $1 AND "user" = $2`, [deviceId, userId]);
  }

  public async deleteAll(): Promise<DeleteResult> {
    return this.dataSource.query(`DELETE FROM user_security`);
  }

  public async getDevice(deviceId: number): Promise<SecurityEntity> {
    const d = await this.dataSource.query(`SELECT * FROM user_security WHERE id = $1 LIMIT 1`, [deviceId]);
    return d.length > 0 ? d[0] : null;
  }

  public async updateDevice(payload: SecurityEntity) {
    await this.dataSource.query(
      `UPDATE user_security SET "ip" = $1, "title" = $2, "userAgent" = $3 WHERE id = $4 RETURNING *`,
      [payload.ip, payload.title, payload.userAgent, payload.id],
    );
  }
}
