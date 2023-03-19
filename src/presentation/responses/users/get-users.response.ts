import { Exclude, Expose } from 'class-transformer';
import { MetaResponse } from '../meta.response';

@Exclude()
export class GetUser {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;
}

@Exclude()
export class GetUsersResponse extends MetaResponse {
  @Expose()
  items: GetUser[];
}
