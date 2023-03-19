import { Exclude, Expose, Transform } from 'class-transformer';
import { MetaResponse } from '../meta.response';

@Exclude()
export class GetUser {
  @Expose({ name: '_id' })
  @Transform(({ value }) => value?.toString())
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
