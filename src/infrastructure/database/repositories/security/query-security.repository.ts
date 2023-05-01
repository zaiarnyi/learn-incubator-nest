import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Security, SecurityDocument, SecurityEntity } from '../../../../domain/security/entity/security.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class QuerySecurityRepository {
  constructor(
    @InjectModel(Security.name) private securityModel: Model<SecurityDocument>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  public async getDevicesByUserId(userId: number): Promise<SecurityDocument[]> {
    const d = await this.dataSource.query(`SELECT * FROM user_security WHERE "user" = $1 LIMIT 1`, [userId]);
    return d;
  }

  public async getDevicesByUserIdAndDevice(userId: number, deviceId: number): Promise<SecurityDocument> {
    const d = await this.dataSource.query(`SELECT * FROM user_security WHERE "user" = $1 AND id = $2 LIMIT 1`, [
      userId,
      deviceId,
    ]);
    return d.length > 0 ? d[0] : null;
  }

  public async getDeviceById(deviceId: number): Promise<SecurityEntity> {
    const d = await this.dataSource.query(`SELECT * FROM user_security WHERE id = $1 LIMIT 1`, [deviceId]);
    return d.length > 0 ? d[0] : null;
  }
}
