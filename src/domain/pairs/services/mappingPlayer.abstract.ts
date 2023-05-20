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

@Injectable()
export class MappingPlayerAbstract {
  constructor(
    @Inject(QueryPairsRepository) protected readonly repository: QueryPairsRepository,
    @Inject(QueryAnswerRepository) private readonly answerRepository: QueryAnswerRepository,
  ) {}
  private async mappingAnswers(user: UserEntity, pair: PairsEntity): Promise<AnswerResponse[] | null> {
    const answersForUser = await this.answerRepository.getPairByUserAndId(user.id, pair.id);

    if (!answersForUser.length) return [];
    const questions = pair.questions.slice(0, answersForUser.length);

    if (!questions.length) return [];

    return questions.map((item, i) => {
      return plainToClass(AnswerResponse, {
        questionId: item.id.toString(),
        answerStatus: answersForUser[i].status,
        addedAt: answersForUser[i].addedAt,
      });
    });
  }

  public async mappingForActiveStatus(pair: PairsEntity): Promise<GetCurrentPairResponse> {
    return plainToClass(GetCurrentPairResponse, {
      ...pair,
      id: pair.id.toString(),
      firstPlayerProgress: {
        player: {
          ...pair.firstPlayer,
          id: pair.firstPlayer.id.toString(),
        },
        score: pair.scoreFirstPlayer,
        answers: await this.mappingAnswers(pair.firstPlayer, pair),
      },
      secondPlayerProgress: {
        player: {
          ...pair.secondPlayer,
          id: pair.secondPlayer.id.toString(),
        },
        score: pair.scoreSecondPlayer,
        answers: await this.mappingAnswers(pair.secondPlayer, pair),
      },
      questions: pair?.questions?.map((item) => ({ ...item, id: item.id.toString() })) ?? null,
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
        score: pair.scoreFirstPlayer,
        answers: await this.mappingAnswers(pair.firstPlayer, pair),
      },
      questions: pair?.questions?.map((item) => ({ ...item, id: item.id.toString() })) ?? null,
      secondPlayerProgress: null,
      pairCreatedDate: pair.createdAt,
    });
  }
}
