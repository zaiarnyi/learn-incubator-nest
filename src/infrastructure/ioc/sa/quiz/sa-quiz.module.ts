import { Module } from '@nestjs/common';
import { SaQuizController } from '../../../../presentation/controllers/sa/quiz/sa-quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizEntity } from '../../../../domain/sa/quiz/entities/quiz.entity';
import { ChangeQuizActions } from '../../../../application/actions/sa/quiz/change-quiz.actions';
import { ChangeStatusQuizAction } from '../../../../application/actions/sa/quiz/change-status-quiz.action';
import { CreateQuizAction } from '../../../../application/actions/sa/quiz/create-quiz.action';
import { DeleteQuizActions } from '../../../../application/actions/sa/quiz/delete-quiz.actions';
import { GetListQuestionAction } from '../../../../application/actions/sa/quiz/get-list-question.action';
import { QueryQuizRepository } from '../../../database/repositories/sa/quiz/query-quiz.repository';
import { MainQuizRepository } from '../../../database/repositories/sa/quiz/main-quiz.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QuizEntity])],
  controllers: [SaQuizController],
  providers: [
    ChangeQuizActions,
    ChangeStatusQuizAction,
    CreateQuizAction,
    DeleteQuizActions,
    GetListQuestionAction,
    QueryQuizRepository,
    MainQuizRepository,
  ],
  exports: [QueryQuizRepository, MainQuizRepository],
})
export class SaQuizModule {}
