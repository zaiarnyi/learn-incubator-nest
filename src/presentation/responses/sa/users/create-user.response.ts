import { Exclude, Expose, Type } from 'class-transformer';
import { BanInfo } from './get-users.response';
import { ValidateNested } from 'class-validator';

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

  @Expose()
  @Type(() => BanInfo)
  @ValidateNested()
  banInfo: BanInfo;
}
