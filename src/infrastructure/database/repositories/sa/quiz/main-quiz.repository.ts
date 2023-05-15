import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizEntity } from '../../../../../domain/sa/quiz/entities/quiz.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MainQuizRepository {
  constructor(@InjectRepository(QuizEntity) private readonly repository: Repository<QuizEntity>) {}

  async save(payload: QuizEntity): Promise<QuizEntity> {
    return this.repository.save(payload);
  }

  async update(payload: QuizEntity) {
    await this.repository.update({ id: payload.id }, payload);
  }

  async deleteQuiz(id: number) {
    return this.repository.delete({ id });
  }
}
