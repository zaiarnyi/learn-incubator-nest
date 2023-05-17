import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairsEntity } from '../../../../domain/pairs/entity/pairs.entity';
import { IsNull, Repository } from 'typeorm';
import { PairStatusesEnum } from '../../../../domain/pairs/enums/pair-statuses.enum';

@Injectable()
export class QueryPairsRepository {
  constructor(@InjectRepository(PairsEntity) private readonly repository: Repository<PairsEntity>) {}

  async getPendingRoom(): Promise<PairsEntity> {
    return this.repository.findOne({
      where: {
        status: PairStatusesEnum.PENDING_SECOND_PLAYER,
        secondPlayer: IsNull(),
      },
      relations: ['firstPlayer'],
    });
  }
}
