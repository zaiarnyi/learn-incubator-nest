import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MeResponse {
  @Expose()
  email: string;

  @Expose()
  login: string;

  @Expose()
  userId: string;
}
