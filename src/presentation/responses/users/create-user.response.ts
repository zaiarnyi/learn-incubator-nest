import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserResponse {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;
}
