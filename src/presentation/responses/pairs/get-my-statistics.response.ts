import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetMyStatisticsResponse {
  @Expose()
  subScore: number;

  @Expose()
  avgScore: number;

  @Expose()
  gamesCount: number;

  @Expose()
  winsCount: number;

  @Expose()
  lossesCount: number;

  @Expose()
  drawsCount: number;
}
