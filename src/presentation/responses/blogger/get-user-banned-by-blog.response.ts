import { MetaResponse } from '../meta.response';
import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@Exclude()
class UserBannedInfo {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  banDate: Date;

  @Expose()
  banReason: string;
}

@Exclude()
export class GetUserBannedByBlogResponse extends MetaResponse {
  @Expose()
  @ValidateNested()
  @Type(() => UserBannedInfo)
  items: UserBannedInfo[];
}
