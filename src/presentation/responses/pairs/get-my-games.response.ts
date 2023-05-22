import { MetaResponse } from '../meta.response';
import { GetCurrentPairResponse } from './get-current-pair.response';

export class GetMyGamesResponse extends MetaResponse {
  items: GetCurrentPairResponse[];
}
