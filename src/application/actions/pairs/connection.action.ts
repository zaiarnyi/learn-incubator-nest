import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { GetCurrentPairResponse } from '../../../presentation/responses/pairs/get-current-pair.response';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { QueryPairsRepository } from '../../../infrastructure/database/repositories/pairs/query.repository';
import { MainPairRepository } from '../../../infrastructure/database/repositories/pairs/pair.repository';
import { QueryQuizRepository } from '../../../infrastructure/database/repositories/sa/quiz/query-quiz.repository';
import { PairsEntity } from '../../../domain/pairs/entity/pairs.entity';
import { PairStatusesEnum } from '../../../domain/pairs/enums/pair-statuses.enum';
import { MappingPlayerAbstract } from '../../../domain/pairs/services/mappingPlayer.abstract';

@Injectable()
export class ConnectionPairAction {
  constructor(
    @Inject(MappingPlayerAbstract) private readonly mapping: MappingPlayerAbstract,
    @Inject(MainPairRepository) private readonly mainRepository: MainPairRepository,
    @Inject(QueryQuizRepository) private readonly quizRepository: QueryQuizRepository,
    @Inject(QueryPairsRepository) protected readonly repository: QueryPairsRepository,
  ) {}

  private async createRoom(user: UserEntity): Promise<PairsEntity> {
    const pair = new PairsEntity();
    pair.firstPlayer = user;
    return this.mainRepository.saveRoom(pair);
  }

  private async checkPendingStatus(user: UserEntity): Promise<PairsEntity> {
    const pair = await this.repository.getPendingRoom();

    if (!pair) return null;

    // if (pair.firstPlayer.id === user.id) {
    //   throw new ForbiddenException();
    // }

    pair.secondPlayer = user;
    pair.startGameDate = new Date();
    pair.status = PairStatusesEnum.ACTIVE;
    pair.questions = await this.quizRepository.findAnswerForPair();

    return this.mainRepository.saveRoom(pair);
  }

  public async execute(user: UserEntity): Promise<GetCurrentPairResponse | any> {
    const hasActiveGame = await this.repository.getActiveGameByUserId(user);
    if (hasActiveGame) {
      throw new ForbiddenException();
    }
    const hasFirstPlayer = await this.checkPendingStatus(user);

    if (hasFirstPlayer && hasFirstPlayer.status === PairStatusesEnum.ACTIVE) {
      return this.mapping.mappingForActiveStatus(hasFirstPlayer);
    }

    if (hasFirstPlayer && hasFirstPlayer.status === PairStatusesEnum.PENDING_SECOND_PLAYER) {
      return this.mapping.mappingForPendingStatus(hasFirstPlayer);
    }

    const createPair = await this.createRoom(user);
    return this.mapping.mappingForPendingStatus(createPair);
  }
}
