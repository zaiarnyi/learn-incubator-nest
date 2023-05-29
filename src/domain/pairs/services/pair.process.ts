import { Inject, Injectable } from '@nestjs/common';
import { MainPairRepository } from '../../../infrastructure/database/repositories/pairs/pair.repository';
import { PairStatusesEnum } from '../enums/pair-statuses.enum';
import { QueryPairsRepository } from '../../../infrastructure/database/repositories/pairs/query.repository';

@Injectable()
export class PairProcess {
  constructor(
    @Inject(MainPairRepository) private readonly repository: MainPairRepository,
    @Inject(QueryPairsRepository) private readonly queryRepository: QueryPairsRepository,
  ) {}

  public async execute(payload: { pairId: number; userId: number }): Promise<void> {
    const activeGame = await this.queryRepository.getActiveGame(payload.pairId);
    if (!activeGame) return;

    await this.repository.changeStatus(payload.pairId, PairStatusesEnum.FINISH);

    const firstPlayer = activeGame.firstPlayer.id === payload.userId;
    const secondPlayer = activeGame.secondPlayer.id === payload.userId;

    if (firstPlayer && activeGame.scoreFirstPlayer) {
      await this.repository.setScore(payload.pairId, 'scoreFirstPlayer', activeGame.scoreFirstPlayer + 1);
    } else if (secondPlayer && activeGame.scoreSecondPlayer) {
      await this.repository.setScore(payload.pairId, 'scoreSecondPlayer', activeGame.scoreSecondPlayer + 1);
    }
  }
}
