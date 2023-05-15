import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ChangeStatusQuizDto } from '../../../../domain/sa/quiz/dto/change-status-quiz.dto';
import { MainQuizRepository } from '../../../../infrastructure/database/repositories/sa/quiz/main-quiz.repository';
import { QueryQuizRepository } from '../../../../infrastructure/database/repositories/sa/quiz/query-quiz.repository';
import { QuizEntity } from '../../../../domain/sa/quiz/entities/quiz.entity';

@Injectable()
export class ChangeStatusQuizAction {
  constructor(
    @Inject(MainQuizRepository) private readonly mainRepository: MainQuizRepository,
    @Inject(QueryQuizRepository) private readonly queryRepository: QueryQuizRepository,
  ) {}

  private async validationAndGetQuiz(id: number): Promise<QuizEntity> {
    return this.queryRepository.findById(id).catch(() => {
      throw new NotFoundException();
    });
  }
  public async execute(id: number, payload: ChangeStatusQuizDto) {
    const quiz = await this.validationAndGetQuiz(id);

    quiz.published = payload.published;
    await this.mainRepository.save(quiz);
  }
}
