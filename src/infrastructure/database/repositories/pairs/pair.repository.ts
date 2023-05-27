import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairsEntity } from '../../../../domain/pairs/entity/pairs.entity';
import { Repository } from 'typeorm';
import { PairStatusesEnum } from '../../../../domain/pairs/enums/pair-statuses.enum';
import { PairResultsEntity } from '../../../../domain/pairs/entity/pairResults.entity';
import { UserEntity } from '../../../../domain/users/entities/user.entity';

@Injectable()
export class MainPairRepository {
  constructor(
    @InjectRepository(PairsEntity) private readonly repository: Repository<PairsEntity>,
    @InjectRepository(PairResultsEntity) private readonly topUserRepository: Repository<PairResultsEntity>,
  ) {}

  async saveRoom(pair: PairsEntity): Promise<PairsEntity> {
    return this.repository.save(pair);
  }

  async savePlayer(player: PairResultsEntity) {
    return this.topUserRepository.save(player);
  }

  async changeStatus(id: number, status: PairStatusesEnum) {
    return this.repository.update({ id }, { status, finishGameDate: new Date() });
  }

  async setScore(id: number, player: string, score: number) {
    return this.repository.update({ id }, { [player]: score });
  }

  async updatePlayerResults(user: UserEntity, result: PairResultsEntity) {
    return this.topUserRepository.update(
      { userId: user.id },
      {
        avgScores: result.avgScores,
        sumScore: result.sumScore,
        lossesCount: result.lossesCount,
        drawsCount: result.drawsCount,
        winsCount: result.winsCount,
      },
    );
  }
}
