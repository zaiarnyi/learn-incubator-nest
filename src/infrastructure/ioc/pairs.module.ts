import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairsEntity } from '../../domain/pairs/entity/pairs.entity';
import { ConnectionPairAction } from '../../application/actions/pairs/connection.action';
import { PairsController } from '../../presentation/controllers/pairs.controller';
import { QueryPairsRepository } from '../database/repositories/pairs/query.repository';
import { MainPairRepository } from '../database/repositories/pairs/pair.repository';
import { SaQuizModule } from './sa/quiz/sa-quiz.module';
import { GetMyCurrentAction } from '../../application/actions/pairs/get-my-current.action';
import { GetPairByIdAction } from '../../application/actions/pairs/get-pair-by-id.action';
import { PairAnswersEntity } from '../../domain/pairs/entity/answers.entity';
import { CreateAnswerAction } from '../../application/actions/pairs/create-answer.action';
import { QueryAnswerRepository } from '../database/repositories/pairs/answer/query-answer.repository';
import { AnswerPairRepository } from '../database/repositories/pairs/answer/answer-pair.repository';
import { MappingPlayerAbstract } from '../../domain/pairs/services/mappingPlayer.abstract';
import { GetMyGamesAction } from '../../application/actions/pairs/get-my-games.action';
import { GetMyStatisticsAction } from '../../application/actions/pairs/get-my-statistics.action';
import { GetUsersTopAction } from '../../application/actions/pairs/get-users-top.action';
import { PairResultsEntity } from '../../domain/pairs/entity/pairResults.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PairsEntity, PairAnswersEntity, PairResultsEntity]), SaQuizModule],
  controllers: [PairsController],
  providers: [
    MappingPlayerAbstract,
    ConnectionPairAction,
    QueryPairsRepository,
    MainPairRepository,
    GetMyCurrentAction,
    GetPairByIdAction,
    CreateAnswerAction,
    QueryAnswerRepository,
    AnswerPairRepository,
    GetMyGamesAction,
    GetMyStatisticsAction,
    GetUsersTopAction,
  ],
  exports: [MainPairRepository],
})
export class PairsModule {}
