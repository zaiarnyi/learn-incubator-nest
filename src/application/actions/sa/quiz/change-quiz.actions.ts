import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizDto } from '../../../../domain/sa/quiz/dto/create-quiz.dto';
import { MainQuizRepository } from '../../../../infrastructure/database/repositories/sa/quiz/main-quiz.repository';
import { QueryQuizRepository } from '../../../../infrastructure/database/repositories/sa/quiz/query-quiz.repository';
import { QuizEntity } from '../../../../domain/sa/quiz/entities/quiz.entity';

@Injectable()
export class ChangeQuizActions {
  constructor(
    @Inject(MainQuizRepository) private readonly mainRepository: MainQuizRepository,
    @Inject(QueryQuizRepository) private readonly queryRepository: QueryQuizRepository,
  ) {}

  private async validationAndGetQuiz(id: number): Promise<QuizEntity> {
    return this.queryRepository.findById(id).catch(() => {
      throw new NotFoundException();
    });
  }
  public async execute(id: number, payload: CreateQuizDto) {
    const quiz = await this.validationAndGetQuiz(id);

    quiz.body = payload.body;
    quiz.correctAnswers = payload.correctAnswers;
    await this.mainRepository.save(quiz);
  }
}
