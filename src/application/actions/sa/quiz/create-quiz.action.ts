import { Inject, Injectable } from '@nestjs/common';
import { CreateQuizResponse } from '../../../../presentation/responses/sa/quiz/create-quiz.response';
import { CreateQuizDto } from '../../../../domain/sa/quiz/dto/create-quiz.dto';
import { MainQuizRepository } from '../../../../infrastructure/database/repositories/sa/quiz/main-quiz.repository';
import { QuizEntity } from '../../../../domain/sa/quiz/entities/quiz.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CreateQuizAction {
  constructor(@Inject(MainQuizRepository) private readonly mainRepository: MainQuizRepository) {}
  public async execute(payload: CreateQuizDto): Promise<CreateQuizResponse> {
    const newQuiz = new QuizEntity();
    newQuiz.body = payload.body;
    newQuiz.correctAnswers = payload.correctAnswers;

    const saved = await this.mainRepository.save(newQuiz);
    return plainToClass(CreateQuizResponse, saved);
  }
}
