import { Inject, Injectable } from '@nestjs/common';
import { MainPairRepository } from '../../../infrastructure/database/repositories/pairs/pair.repository';
import { PairStatusesEnum } from '../enums/pair-statuses.enum';

@Injectable()
export class PairProcess {
  constructor(@Inject(MainPairRepository) private readonly repository: MainPairRepository) {}

  public async execute(payload: { pairId: number }): Promise<void> {
    await this.repository.changeStatus(payload.pairId, PairStatusesEnum.FINISH);
  }
}
