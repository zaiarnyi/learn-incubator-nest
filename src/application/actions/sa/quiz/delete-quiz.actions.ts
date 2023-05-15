import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MainQuizRepository } from '../../../../infrastructure/database/repositories/sa/quiz/main-quiz.repository';
import { QueryQuizRepository } from '../../../../infrastructure/database/repositories/sa/quiz/query-quiz.repository';
import { QuizEntity } from '../../../../domain/sa/quiz/entities/quiz.entity';

@Injectable()
export class DeleteQuizActions {
  constructor(
    @Inject(MainQuizRepository) private readonly mainRepository: MainQuizRepository,
    @Inject(QueryQuizRepository) private readonly queryRepository: QueryQuizRepository,
  ) {}

  private async validationAndGetQuiz(id: number): Promise<QuizEntity> {
    return this.queryRepository.findById(id).catch(() => {
      throw new NotFoundException();
    });
  }
  public async execute(id: number) {
    await this.validationAndGetQuiz(id);
    await this.mainRepository.deleteQuiz(id);
  }
}
