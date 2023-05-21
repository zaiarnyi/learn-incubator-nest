import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairsEntity } from '../../../../domain/pairs/entity/pairs.entity';
import { Repository } from 'typeorm';
import { PairStatusesEnum } from '../../../../domain/pairs/enums/pair-statuses.enum';
import { QuizEntity } from '../../../../domain/sa/quiz/entities/quiz.entity';

@Injectable()
export class MainPairRepository {
  constructor(@InjectRepository(PairsEntity) private readonly repository: Repository<PairsEntity>) {}

  async saveRoom(pair: PairsEntity): Promise<PairsEntity> {
    return this.repository.save(pair);
  }

  async updatePair(id: number, pair: PairsEntity) {
    return this.repository.update(
      { id },
      {
        secondPlayer: pair.secondPlayer,
        status: pair.status,
        startGameDate: pair.startGameDate,
        ...(pair.questions.length && { questions: pair.questions }),
      },
    );
  }

  async changeStatus(id: number, status: PairStatusesEnum) {
    return this.repository.update({ id }, { status, finishGameDate: new Date() });
  }

  async setScore(id: number, player: string, score: number) {
    return this.repository.update({ id }, { [player]: score });
  }

  async setQuestions(id: number, questions: QuizEntity[]) {
    return this.repository.update({ id }, { questions });
  }
}
