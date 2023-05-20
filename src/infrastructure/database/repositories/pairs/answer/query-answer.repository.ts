import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairAnswersEntity } from '../../../../../domain/pairs/entity/answers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QueryAnswerRepository {
  constructor(@InjectRepository(PairAnswersEntity) readonly answerRepository: Repository<PairAnswersEntity>) {}

  async getPairById(id: number): Promise<PairAnswersEntity[]> {
    return this.answerRepository.find({
      where: {
        pair: {
          id,
        },
      },
      relations: ['pair'],
    });
  }

  async getPairByUserAndId(userId: number, pairId: number): Promise<PairAnswersEntity[]> {
    return this.answerRepository.find({
      where: {
        pair: { id: pairId },
        user: { id: userId },
      },
      relations: ['user', 'pair'],
    });
  }
}
