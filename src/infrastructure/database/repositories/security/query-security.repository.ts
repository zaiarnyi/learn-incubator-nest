import { SecurityEntity } from '../../../../domain/security/entity/security.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

export class QuerySecurityRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(SecurityEntity) private readonly repository: Repository<SecurityEntity>,
  ) {}

  public async getDevicesByUserId(userId: number): Promise<SecurityEntity[]> {
    return this.repository
      .createQueryBuilder('s')
      .leftJoin('s.user', 'u')
      .where('u.id = :id', { id: userId })
      .getMany();
  }

  public async getDevicesByUserIdAndDevice(userId: number, deviceId: number): Promise<SecurityEntity> {
    return this.repository
      .createQueryBuilder('s')
      .leftJoin('s.user', 'u')
      .where('s.id = :userId', { userId: userId })
      .andWhere('s.id = :id', { id: deviceId })
      .getOne();
  }

  public async getDeviceById(deviceId: number): Promise<SecurityEntity> {
    return this.repository.findOne({ where: { id: deviceId }, relations: ['user'] });
  }
}
