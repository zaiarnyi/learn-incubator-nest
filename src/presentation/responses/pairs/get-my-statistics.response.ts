import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetMyStatisticsResponse {
  @Expose()
  sumScore: number;

  @Expose()
  avgScores: number;

  @Expose()
  gamesCount: number;

  @Expose()
  winsCount: number;

  @Expose()
  lossesCount: number;

  @Expose()
  drawsCount: number;
}
