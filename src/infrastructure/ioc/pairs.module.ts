import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PairsEntity } from '../../domain/pairs/entity/pairs.entity';
import { ConnectionPairAction } from '../../application/actions/pairs/connection.action';
import { PairsController } from '../../presentation/controllers/pairs.controller';
import { QueryPairsRepository } from '../database/repositories/pairs/query.repository';
import { MainPairRepository } from '../database/repositories/pairs/pair.repository';
import { SaQuizModule } from './sa/quiz/sa-quiz.module';

@Module({
  imports: [TypeOrmModule.forFeature([PairsEntity]), SaQuizModule],
  controllers: [PairsController],
  providers: [ConnectionPairAction, QueryPairsRepository, MainPairRepository],
})
export class PairsModule {}
