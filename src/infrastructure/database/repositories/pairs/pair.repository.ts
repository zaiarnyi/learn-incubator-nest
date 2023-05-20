import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairsEntity } from '../../../../domain/pairs/entity/pairs.entity';
import { Repository } from 'typeorm';
import { PairStatusesEnum } from '../../../../domain/pairs/enums/pair-statuses.enum';

@Injectable()
export class MainPairRepository {
  constructor(@InjectRepository(PairsEntity) private readonly repository: Repository<PairsEntity>) {}

  async saveRoom(pair: PairsEntity): Promise<PairsEntity> {
    return this.repository.save(pair);
  }

  async changeStatus(id: number, status: PairStatusesEnum) {
    return this.repository.update({ id }, { status });
  }

  async setScore(id: number, player: string, score: number) {
    return this.repository.update({ id }, { [player]: score });
  }
}
