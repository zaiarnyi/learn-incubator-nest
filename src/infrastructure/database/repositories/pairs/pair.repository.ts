import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairsEntity } from '../../../../domain/pairs/entity/pairs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MainPairRepository {
  constructor(@InjectRepository(PairsEntity) private readonly repository: Repository<PairsEntity>) {}

  async saveRoom(pair: PairsEntity): Promise<PairsEntity> {
    return this.repository.save(pair);
  }
}
