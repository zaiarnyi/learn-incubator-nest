import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../../domain/users/entities/user.entity';
import { GetMyStatisticsResponse } from '../../../presentation/responses/pairs/get-my-statistics.response';
import { QueryPairsRepository } from '../../../infrastructure/database/repositories/pairs/query.repository';
import { plainToClass } from 'class-transformer';
import { PairsEntity } from '../../../domain/pairs/entity/pairs.entity';
import { ConditionStatistic, DetectScorePlayerEnum } from '../../../domain/pairs/enums/detectScorePlayer.enum';
import { PairStatusesEnum } from '../../../domain/pairs/enums/pair-statuses.enum';

@Injectable()
export class GetMyStatisticsAction {
  constructor(@Inject(QueryPairsRepository) protected readonly repository: QueryPairsRepository) {}

  private detectPlayer(user: UserEntity, game: PairsEntity): DetectScorePlayerEnum {
    if (game.firstPlayer.id === user.id) {
      return DetectScorePlayerEnum.SCORE_FIRST_PLAYER;
    }
    return DetectScorePlayerEnum.SCORE_SECOND_PLAYER;
  }

  private detectDiffPlayer(user: UserEntity, game: PairsEntity): DetectScorePlayerEnum {
    if (game.firstPlayer.id !== user.id) {
      return DetectScorePlayerEnum.SCORE_FIRST_PLAYER;
    }
    return DetectScorePlayerEnum.SCORE_SECOND_PLAYER;
  }

  private getSumScoreCurrentUser(user: UserEntity, games: PairsEntity[]): number {
    return games.reduce((acc, item) => {
      acc += item[this.detectPlayer(user, item)];
      return acc;
    }, 0);
  }

  private async getGames(user: UserEntity): Promise<PairsEntity[]> {
    return await this.repository.getGamesForUser(user).catch(() => {
      throw new NotFoundException();
    });
  }

  private checkResultGame(user: UserEntity, games: PairsEntity[], condition: ConditionStatistic): number {
    const result = games.filter((item) => {
      const myPlayer = this.detectPlayer(user, item);
      const diffPlayer = this.detectDiffPlayer(user, item);
      console.log(myPlayer, diffPlayer, 'score players');
      if (item.status === PairStatusesEnum.FINISH && condition === ConditionStatistic.WIN) {
        return item[myPlayer] > item[diffPlayer];
      } else if (item.status === PairStatusesEnum.FINISH && condition === ConditionStatistic.LOSSES) {
        return item[myPlayer] < item[diffPlayer];
      } else if (item.status === PairStatusesEnum.FINISH && condition === ConditionStatistic.DRAW) {
        return item[myPlayer] === item[diffPlayer];
      }
    });
    return result.length;
  }
  public async execute(user: UserEntity): Promise<GetMyStatisticsResponse> {
    const games = await this.getGames(user);

    const sumScore = this.getSumScoreCurrentUser(user, games);
    const gamesCount = games.length;
    const avgScores = parseFloat((sumScore / gamesCount).toFixed(2).replace(/\.00$/, ''));
    const winsCount = this.checkResultGame(user, games, ConditionStatistic.WIN);
    const lossesCount = this.checkResultGame(user, games, ConditionStatistic.LOSSES);
    const drawsCount = this.checkResultGame(user, games, ConditionStatistic.DRAW);
    console.log(
      {
        sumScore,
        avgScores,
        gamesCount,
        winsCount,
        lossesCount,
        drawsCount,
      },
      '=====',
    );
    return plainToClass(GetMyStatisticsResponse, {
      sumScore,
      avgScores,
      gamesCount,
      winsCount,
      lossesCount,
      drawsCount,
    });
  }
}
