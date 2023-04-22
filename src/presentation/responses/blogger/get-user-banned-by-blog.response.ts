import { MetaResponse } from '../meta.response';
import { Exclude, Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@Exclude()
class BanInfo {
  @Expose()
  isBanned: boolean;

  @Expose()
  banDate: Date;

  @Expose()
  banReason: string;
}

@Exclude()
class UserBannedInfo {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  @ValidateNested()
  @Type(() => BanInfo)
  banInfo: BanInfo;
}

@Exclude()
export class GetUserBannedByBlogResponse extends MetaResponse {
  @Expose()
  @ValidateNested()
  @Type(() => UserBannedInfo)
  items: UserBannedInfo[];
}
