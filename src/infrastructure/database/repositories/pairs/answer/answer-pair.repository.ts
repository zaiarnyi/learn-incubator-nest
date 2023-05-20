import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PairAnswersEntity } from '../../../../../domain/pairs/entity/answers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnswerPairRepository {
  constructor(@InjectRepository(PairAnswersEntity) readonly answerRepository: Repository<PairAnswersEntity>) {}

  async save(answer: PairAnswersEntity): Promise<PairAnswersEntity> {
    return this.answerRepository.save(answer);
  }
}
