import { MetaResponse } from '../meta.response';
import { GetMyStatisticsResponse } from './get-my-statistics.response';
import { Player } from './get-current-pair.response';
import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@Exclude()
class UserTop extends GetMyStatisticsResponse {
  @ValidateNested()
  @Type(() => Player)
  @Expose()
  player: Player;
}

@Exclude()
export class GetUsersTopResponse extends MetaResponse {
  @ValidateNested()
  @Type(() => UserTop)
  @Expose()
  items: UserTop[];
}
