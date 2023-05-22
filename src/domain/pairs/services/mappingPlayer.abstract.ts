import { PairsEntity } from '../entity/pairs.entity';
import {
  AnswerResponse,
  GetCurrentPairResponse,
} from '../../../presentation/responses/pairs/get-current-pair.response';
import { plainToClass } from 'class-transformer';
import { Inject, Injectable } from '@nestjs/common';
import { QueryPairsRepository } from '../../../infrastructure/database/repositories/pairs/query.repository';
import { UserEntity } from '../../users/entities/user.entity';
import { QueryAnswerRepository } from '../../../infrastructure/database/repositories/pairs/answer/query-answer.repository';
import { QuizEntity } from '../../sa/quiz/entities/quiz.entity';
import { AnswersStatusesEnum } from '../enums/answers-statuses.enum';

@Injectable()
export class MappingPlayerAbstract {
  constructor(
    @Inject(QueryPairsRepository) protected readonly repository: QueryPairsRepository,
    @Inject(QueryAnswerRepository) private readonly answerRepository: QueryAnswerRepository,
  ) {}

  private mappingQuestions(questions: QuizEntity[]) {
    if (!questions?.length) return null;
    return questions.map((item) => ({ ...item, id: item.id.toString() }));
  }
  private async mappingAnswers(user: UserEntity, pair: PairsEntity): Promise<AnswerResponse[]> {
    const answersForUser = await this.answerRepository.getPairByUserAndId(user.id, pair.id);

    if (!answersForUser.length) return [];

    return answersForUser.map((item, i) => {
      return plainToClass(AnswerResponse, {
        questionId: item.question.id.toString(),
        answerStatus: item.status,
        addedAt: item.addedAt,
      });
    });
  }

  private scoreResult(answers: AnswerResponse[], isAddAdditionalScore: boolean): number {
    const counter = answers.filter((item) => item.answerStatus === AnswersStatusesEnum.CORRECT);
    const additionalScore = isAddAdditionalScore ? 1 : 0;

    console.log(
      answers.length,
      additionalScore,
      '======scoreResult',
      answers.map((item) => item.answerStatus),
    );

    return counter.length + additionalScore;
  }

  public async mappingForActiveStatus(pair: PairsEntity): Promise<GetCurrentPairResponse> {
    const answersForFirstPlayer = await this.mappingAnswers(pair.firstPlayer, pair);
    const answersForSecondPlayer = await this.mappingAnswers(pair.secondPlayer, pair);
    const scoreForFirstPlayer = this.scoreResult(answersForFirstPlayer, pair.playerFirstFinish === pair.firstPlayer.id);
    const scoreForSecondPlayer = this.scoreResult(
      answersForFirstPlayer,
      pair.playerFirstFinish === pair.secondPlayer.id,
    );

    return plainToClass(GetCurrentPairResponse, {
      ...pair,
      id: pair.id.toString(),
      firstPlayerProgress: {
        player: {
          ...pair.firstPlayer,
          id: pair.firstPlayer.id.toString(),
        },
        score: scoreForFirstPlayer,
        answers: answersForFirstPlayer,
      },
      secondPlayerProgress: {
        player: {
          ...pair.secondPlayer,
          id: pair.secondPlayer.id.toString(),
        },
        score: scoreForSecondPlayer,
        answers: answersForSecondPlayer,
      },
      questions: this.mappingQuestions(pair.questions),
      pairCreatedDate: pair.createdAt,
    });
  }
  public async mappingForPendingStatus(pair: PairsEntity): Promise<GetCurrentPairResponse> {
    return plainToClass(GetCurrentPairResponse, {
      ...pair,
      id: pair.id.toString(),
      firstPlayerProgress: {
        player: {
          ...pair.firstPlayer,
          id: pair.firstPlayer.id.toString(),
        },
        score: 0,
        answers: [],
      },
      questions: null,
      secondPlayerProgress: null,
      pairCreatedDate: pair.createdAt,
    });
  }
}
