import { Inject, Injectable } from '@nestjs/common';
import { GetCurrentPairResponse } from '../../../presentation/responses/pairs/get-current-pair.response';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { QueryPairsRepository } from '../../../infrastructure/database/repositories/pairs/query.repository';
import { MainPairRepository } from '../../../infrastructure/database/repositories/pairs/pair.repository';
import { QueryQuizRepository } from '../../../infrastructure/database/repositories/sa/quiz/query-quiz.repository';
import { PairsEntity } from '../../../domain/pairs/entity/pairs.entity';
import { plainToClass } from 'class-transformer';
import { AnswersStatusesEnum } from '../../../domain/pairs/enums/answers-statuses.enum';
import { PairStatusesEnum } from '../../../domain/pairs/enums/pair-statuses.enum';

@Injectable()
export class ConnectionPairAction {
  constructor(
    @Inject(QueryPairsRepository) private readonly repository: QueryPairsRepository,
    @Inject(MainPairRepository) private readonly mainRepository: MainPairRepository,
    @Inject(QueryQuizRepository) private readonly quizRepository: QueryQuizRepository,
  ) {}

  private mappingForActiveStatus(pair: PairsEntity): GetCurrentPairResponse {
    return plainToClass(GetCurrentPairResponse, {
      ...pair,
      firstPlayerProgress: {
        player: pair.firstPlayer,
        score: pair.scoreFirstPlayer,
        answers: pair.questions.map((item, i) => {
          const status = pair.firstPlayerCorrectAnswers.includes(i + 1)
            ? AnswersStatusesEnum.CORRECT
            : AnswersStatusesEnum.INCORRECT;
          return {
            questionId: item.id,
            answerStatus: status,
            addedAt: item.createdAt,
          };
        }),
      },
      secondPlayerProgress: {
        player: pair.secondPlayer,
        score: pair.scoreSecondPlayer,
        answers: pair.questions.map((item, i) => {
          const status = pair.secondPlayerCorrectAnswers.includes(i + 1)
            ? AnswersStatusesEnum.CORRECT
            : AnswersStatusesEnum.INCORRECT;
          return {
            questionId: item.id,
            answerStatus: status,
            addedAt: item.createdAt,
          };
        }),
      },
      pairCreatedDate: pair.createdAt,
    });
  }

  private mappingForPendingStatus(pair: PairsEntity): GetCurrentPairResponse {
    return plainToClass(GetCurrentPairResponse, {
      ...pair,
      firstPlayerProgress: {
        player: pair.firstPlayer,
        score: pair.scoreFirstPlayer,
        answers: pair.questions.map((item) => {
          return {
            questionId: item.id,
            answerStatus: null,
            addedAt: item.createdAt,
          };
        }),
      },
      secondPlayerProgress: null,
      pairCreatedDate: pair.createdAt,
    });
  }

  private async createRoom(user: UserEntity): Promise<PairsEntity> {
    const questions = await this.quizRepository.findAnswerForPair();

    const pair = new PairsEntity();
    pair.questions = questions;
    pair.firstPlayer = user;
    return this.mainRepository.saveRoom(pair);
  }

  private async checkPendingStatus(user: UserEntity): Promise<PairsEntity> {
    const pair = await this.repository.getPendingRoom();
    if (!pair) return null;

    pair.secondPlayer = user;
    pair.startGameDate = new Date();
    pair.status = PairStatusesEnum.ACTIVE;
    return this.mainRepository.saveRoom(pair);
  }

  public async execute(user: UserEntity): Promise<GetCurrentPairResponse> {
    const isPending = await this.checkPendingStatus(user);
    if (isPending) {
      return this.mappingForActiveStatus(isPending);
    }

    const createPair = await this.createRoom(user);
    return this.mappingForPendingStatus(createPair);
  }
}
